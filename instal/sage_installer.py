#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
sage_installer.py
=================================================================
Установка SageAttention (pip) для Turing T4 (sm_75).

Больше никакого клонирования форков и компиляции CUDA-ядер.
Ставится официальный пакет sageattention через pip — он тоже
поддерживает sm_75 начиная с версии 1.0.6.

Использует LogManager (logging_ui.py) для вывода — логи попадают
в красивую обвязку start.py.
=================================================================
"""

import subprocess


def install(home_dir, venv_python, logger):
    """Устанавливает sageattention==1.0.6 в venv.

    Параметры:
      home_dir     — /kaggle/working (не используется, но сохранён для API)
      venv_python  — путь к python в venv
      logger       — экземпляр LogManager (из logging_ui.py)

    Возвращает:
      True, если SageAttention установлен и импортируется.
    """
    logger.set_status("⚙️ Устанавливаю SageAttention 1.0.6...", "#f39c12")

    # --- Шаг 0: уже установлен? ---
    logger.print("[*] Проверяю SageAttention...")
    check = subprocess.run(
        [venv_python, "-c", "import sageattention; v = getattr(sageattention, '__version__', '?'); assert v >= '1.0.6', f'version {v} < 1.0.6'"],
        capture_output=True, text=True, timeout=15)
    if check.returncode == 0:
        version = (check.stdout or "").strip()
        logger.print(f"[OK] SageAttention {version} уже установлен (пропуск)")
        return True

    # --- Шаг 1: pip install ---
    logger.print("[*] Устанавливаю sageattention==1.0.6 через pip...")
    result = subprocess.run(
        [venv_python, "-m", "pip", "install", "sageattention==1.0.6"],
        capture_output=True, text=True, timeout=300)

    if result.returncode != 0:
        logger.print("[!] Ошибка установки SageAttention:")
        for line in (result.stderr or "").strip().split("\n")[-10:]:
            logger.print(f"  ⛔ {line}")
        logger.print("[!] Fallback: torch SDPA (без SageAttention)")
        return False

    # --- Шаг 2: верификация ---
    verify = subprocess.run(
        [venv_python, "-c", "import sageattention; print(getattr(sageattention, '__version__', '?'))"],
        capture_output=True, text=True, timeout=15)
    if verify.returncode == 0:
        version = (verify.stdout or "").strip()
        logger.print(f"[OK] SageAttention {version} установлен!")
        return True

    logger.print("[!] Пакет установлен, но не импортируется:")
    for line in (verify.stderr or "").strip().split("\n"):
        logger.print(f"  ⛔ {line}")
    return False
