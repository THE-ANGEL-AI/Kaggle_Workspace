#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
sage_installer.py
=================================================================
Установка SageAttention-SM75-path (Turing T4, sm_75) + инжект
ноды SageAttentionT4_Apply в workflow.

Вынесен из start.py, чтобы start.py оставался тонким.

Использует LogManager (logging_ui.py) для вывода — логи попадают
в красивую обвязку start.py.

Форк: https://github.com/THE-ANGEL-AI/SageAttention-SM75-path.git
Поддержка Turing (sm_75) через CUDA-ядро sageattn_qk_int8_pv_fp16_cuda_sm75.
=================================================================
"""

import os
import subprocess
import sys

# Путь к репозиторию SageAttention (относительно HOME_DIR)
SAGE_SRC_DIR = "sageattention-sm75"

# Форк с поддержкой Turing (sm_75)
SAGE_REPO = "https://github.com/THE-ANGEL-AI/SageAttention-SM75-path.git"


def _run(cmd, **kwargs):
    """Печатает и выполняет команду, возвращает результат."""
    kwargs.setdefault("capture_output", True)
    kwargs.setdefault("text", True)
    kwargs.setdefault("timeout", 120)
    print(f"  $ {' '.join(cmd) if isinstance(cmd, list) else cmd}")
    return subprocess.run(cmd, **kwargs)


def install(home_dir, venv_python, comfy_dir, logger):
    """Собирает SageAttention-SM75 в venv и линкует custom_node.

    Параметры:
      home_dir     — /kaggle/working
      venv_python  — путь к python в venv
      comfy_dir    — путь к ComfyUI (для custom_nodes symlink)
      logger       — экземпляр LogManager (из logging_ui.py)

    Возвращает:
      True, если SageAttention установлен и готов к использованию.
    """
    logger.set_status("⚙️ Проверяю SageAttention-SM75 (Turing)...", "#f39c12")
    sage_ok = False
    sage_src = os.path.join(home_dir, SAGE_SRC_DIR)

    # --- Шаг 0: клонируем/обновляем репозиторий ВСЕГДА ---
    # (даже если пакет уже установлен — чтобы подтянуть свежий код ноды)
    updated = False
    if os.path.isdir(sage_src):
        _ensure_fork_remote(sage_src, logger)
        updated = _update_repo(sage_src, logger)
    else:
        _clone_repo(sage_src, logger)

    if not os.path.isdir(sage_src):
        logger.print("[!] Репозиторий SageAttention не доступен — пропуск")
        return False

    # --- Шаг 0b: уже установлен? ---
    logger.print("[*] Проверяю SageAttention-SM75 (Turing)...")
    check = subprocess.run(
        [venv_python, "-c", "import sageattention"],
        capture_output=True, text=True, timeout=15)
    if check.returncode == 0:
        if updated:
            logger.print("[*] Форк обновился — перекомпилирую SageAttention...")
            logger.set_status("⚙️ Перекомпилирую SageAttention-SM75...", "#f39c12")
            rebuild = subprocess.run(
                [venv_python, "-m", "pip", "install", "-e", ".",
                 "--no-build-isolation", "--no-deps"],
                cwd=sage_src,
                capture_output=True, text=True, timeout=900)
            if rebuild.returncode == 0:
                logger.print("[OK] SageAttention-SM75 перекомпилирован и установлен!")
                _log_version(venv_python, sage_src, logger)
            else:
                logger.print("[!] Перекомпиляция не удалась — работаю со старой версией")
                for line in (rebuild.stderr or "").split("\n")[-8:]:
                    line = line.strip()
                    if line:
                        logger.print(f"  ⛔ {line}")
        else:
            logger.print("[*] SageAttention уже установлен (пропуск)")

        # Всё равно обновляем custom node прокси-пакет (подхватит свежий код)
        _link_custom_node(sage_src, comfy_dir, logger)
        return True

    # --- Шаг 1: build-зависимости ---
    logger.set_status("⚙️ Устанавливаю SageAttention-SM75...", "#f39c12")
    logger.print("[*] Обновляю setuptools + wheel...")
    subprocess.run(
        [venv_python, "-m", "pip", "install", "--upgrade",
         "setuptools", "wheel"],
        capture_output=True, text=True, timeout=120)

    # --- Шаг 3: сборка CUDA-расширения ---
    logger.print("[*] Компилирую CUDA-ядро под sm_75 (это может занять 5-10 мин)...")
    result = subprocess.run(
        [venv_python, "setup.py", "build_ext", "--inplace"],
        cwd=sage_src,
        capture_output=True, text=True, timeout=900)

    # Сохраняем полный лог сборки
    _save_build_log(sage_src, result, logger)

    # --- Шаг 4: анализ результата сборки ---
    if result.returncode != 0:
        _log_build_failure(result, logger)
        return False

    # --- Шаг 5: установка пакета (triton подтянется из install_requires) ---
    sage_ok = _install_package(sage_src, venv_python, logger)
    if not sage_ok:
        logger.print("[!] Fallback: split-cross-attention (без SageAttention)")
        return False

    # --- Шаг 6: симлинк в custom_nodes ---
    _link_custom_node(sage_src, comfy_dir, logger)

    # --- Шаг 7: логируем версию ---
    _log_version(venv_python, sage_src, logger)

    logger.print("[OK] SageAttention-SM75 готов!")
    return True


def _ensure_fork_remote(sage_src, logger):
    """Переключаем remote origin на форк (если раньше клонировали XUANNISSAN)."""
    subprocess.run(
        ["git", "-C", sage_src, "remote", "set-url", "origin", SAGE_REPO],
        capture_output=True, text=True, timeout=30)
    logger.print("[*] Репозиторий уже склонирован — проверяю обновления форка...")


def _update_repo(sage_src, logger):
    """Сбрасывает локальные патчи и делает pull.

    Returns:
        True, если были получены новые изменения из форка.
    """
    # Запоминаем HEAD до pull — чтобы детектить реальные изменения
    before = subprocess.run(
        ["git", "-C", sage_src, "rev-parse", "HEAD"],
        capture_output=True, text=True, timeout=15)

    subprocess.run(
        ["git", "-C", sage_src, "reset", "--hard", "--quiet"],
        capture_output=True, text=True, timeout=30)
    subprocess.run(
        ["git", "-C", sage_src, "fetch", "--quiet"],
        capture_output=True, text=True, timeout=30)
    pull = subprocess.run(
        ["git", "-C", sage_src, "pull", "--ff-only"],
        capture_output=True, text=True, timeout=60)
    if pull.returncode == 0:
        # Сравниваем HEAD после pull
        after = subprocess.run(
            ["git", "-C", sage_src, "rev-parse", "HEAD"],
            capture_output=True, text=True, timeout=15)
        changed = (before.stdout or "").strip() != (after.stdout or "").strip()

        if changed:
            out = (pull.stdout or "").strip()
            if out:
                # Показываем все изменённые файлы (строки с '|' в выводе git pull)
                files = [line.strip() for line in out.splitlines() if '|' in line]
                if files:
                    logger.print("[*] Форк обновлён:")
                    for f in files:
                        logger.print(f"    {f}")
                else:
                    logger.print(f"[*] Форк обновлён: {out.splitlines()[-1]}")
            else:
                logger.print("[*] Форк обновлён: новые коммиты")
        else:
            logger.print("[*] Форк актуален")
        return changed
    else:
        err = (pull.stderr or "").strip()[:200]
        logger.print(f"[!] git pull не удался: {err} (старая версия)")
        return False


def _clone_repo(sage_src, logger):
    """Клонирует форк SageAttention."""
    logger.print("[*] Клонирую SageAttention-SM75-path (форк)...")
    clone = subprocess.run(
        ["git", "clone", SAGE_REPO, sage_src],
        capture_output=True, text=True, timeout=120)
    if clone.returncode != 0:
        err = (clone.stderr or "").strip()[:200]
        logger.print(f"[!] Клонирование не удалось: {err}")


def _save_build_log(sage_src, result, logger):
    """Сохраняет лог сборки в файл."""
    log_text = (result.stdout or "").strip()
    err_text = (result.stderr or "").strip()
    log_path = os.path.join(sage_src, "build_sm75.log")
    try:
        with open(log_path, "w", encoding="utf-8") as f:
            f.write("=== STDOUT ===\n" + log_text + "\n=== STDERR ===\n" + err_text)
        logger.print(f"[*] Полный лог сохранён в {log_path}")
    except OSError:
        pass

    # Парсим ошибки компиляции
    full = log_text + "\n" + err_text
    lines = full.split("\n")
    traceback_start = -1
    for i, l in enumerate(lines):
        if 'File "/kaggle/' in l and 'python' in l.lower():
            traceback_start = i
            break

    if traceback_start > 0:
        compile_lines = lines[:traceback_start]
        logger.print(f"[*] Строк до трейсбека: {len(compile_lines)}")
        err_lines = [
            l for l in compile_lines
            if any(x in l.lower() for x in [
                "error:", "fatal", "undefined", "no member", "not declared",
                "implicit", "failed:", "ninja: build stopped",
                "cannot find", "no such file",
            ])
        ]
        if err_lines:
            logger.print("[!] ОШИБКИ КОМПИЛЯЦИИ/СБОРКИ:")
            for line in err_lines[-40:]:
                logger.print(f"  ⛔ {line}")
            return True  # ошибки найдены
        logger.print("[*] Последние строки компиляции (до трейсбека):")
        for line in compile_lines[-50:]:
            logger.print(f"  {line}")
    else:
        logger.print("[*] Трейсбек не найден, последние строки лога:")
        for line in lines[-30:]:
            logger.print(f"  {line}")
    return False


def _log_build_failure(result, logger):
    """Выводит информацию об ошибке сборки."""
    logger.print(f"[!] Build failed (code {result.returncode})")
    logger.print("[!] Falling back to split-cross-attention (без Sage)")
    logger.set_status("⚠️ SageAttention не установлен — работа без ускорения", "#f39c12")


def _install_package(sage_src, venv_python, logger):
    """Устанавливает собранный пакет в venv (+ triton из install_requires)."""
    logger.print("[*] CUDA kernel compiled, устанавливаю пакет...")
    install = subprocess.run(
        [venv_python, "-m", "pip", "install", "--no-build-isolation", "."],
        cwd=sage_src,
        capture_output=True, text=True, timeout=120)
    for line in (install.stdout or "").split("\n")[-10:]:
        logger.print(f"  {line}")

    # Проверяем установку
    verify = subprocess.run(
        [venv_python, "-c", "import sageattention"],
        capture_output=True, text=True, timeout=15)
    if verify.returncode == 0:
        logger.print("[OK] SageAttention-SM75 installed!")
        return True

    # Полная ошибка импорта (все строки, без усечения)
    err_lines = (verify.stderr or "").strip().split("\n")
    logger.print(f"[!] Пакет не импортируется ({len(err_lines)} строк ошибки):")
    for line in err_lines:
        logger.print(f"  ⛔ {line}")
    return False


def _link_custom_node(sage_src, comfy_dir, logger):
    """Создаёт прокси-пакет SageAttention-T4 в custom_nodes.

    Вместо symlink'а всего репо (ComfyUI/Python не всегда корректно
    читает __init__.py через симлинк) создаём маленькую папку с
    __init__.py, который реимпортирует ноды из sageattn_t4_nodes.
    """
    sage_node_dir = os.path.join(comfy_dir, "custom_nodes", "SageAttention-T4")

    # Удаляем старый симлинк если был
    if os.path.islink(sage_node_dir) or os.path.lexists(sage_node_dir):
        try:
            os.unlink(sage_node_dir)
        except OSError:
            pass

    try:
        os.makedirs(sage_node_dir, exist_ok=True)
        init_py = os.path.join(sage_node_dir, "__init__.py")
        # Экранируем путь для Python-строки (экранируем обратные слеши)
        sage_src_esc = sage_src.replace("\\", "\\\\")
        with open(init_py, "w", encoding="utf-8") as f:
            f.write(
                '"""SageAttention-T4 ComfyUI custom node (proxy)."""\n'
                'import sys, os\n'
                f'_sage_path = r"{sage_src_esc}"\n'
                'if _sage_path not in sys.path:\n'
                '    sys.path.insert(0, _sage_path)\n'
                'from sageattn_t4_nodes import NODE_CLASS_MAPPINGS, NODE_DISPLAY_NAME_MAPPINGS\n'
            )
        logger.print(f"[*] ComfyUI node создан: SageAttention-T4 → {sage_src}")
    except OSError as e:
        logger.print(f"[!] Не удалось создать папку ноды ({e})")


def _log_version(venv_python, sage_src, logger):
    """Логирует версию SageAttention и хеш коммита форка."""
    # Версия пакета (если есть __version__)
    ver = subprocess.run(
        [venv_python, "-c",
         "import sageattention; print(getattr(sageattention, '__version__', 'unknown'))"],
        capture_output=True, text=True, timeout=15)
    version = (ver.stdout or "").strip()

    # Хеш коммита форка
    commit = subprocess.run(
        ["git", "-C", sage_src, "rev-parse", "--short", "HEAD"],
        capture_output=True, text=True, timeout=15)
    commit_hash = (commit.stdout or "").strip()

    logger.print(f"[OK] SageAttention-SM75-path: версия {version} | коммит {commit_hash}")


def inject_into_workflows(comfy_dir, logger):
    """Инжектит SageAttentionT4_Apply в workflow JSON.

    Вызывает scripts/inject_sageattn_workflow.py для всех .json
    в ComfyUI/user/default/workflows/.
    """
    # Путь к инжектору — рядом в scripts/
    injector = os.path.join(
        os.path.dirname(os.path.abspath(__file__)),
        "scripts", "inject_sageattn_workflow.py"
    )
    if not os.path.exists(injector):
        logger.print(f"[!] Инжектор не найден: {injector}")
        return

    workflows_dir = os.path.join(comfy_dir, "user", "default", "workflows")
    if not os.path.isdir(workflows_dir):
        logger.print(f"[!] Папка workflow не найдена: {workflows_dir}")
        logger.print("[*] Инжект SageAttention пропущен — сохрани workflow и перезапусти")
        return

    logger.print("[*] Инжект SageAttention-T4 в workflow...")
    subprocess.run(
        [sys.executable, injector, workflows_dir],
        check=False)
    logger.print("[*] Инжект завершён")
