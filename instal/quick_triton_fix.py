#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
quick_triton_fix.py
Быстрая диагностика и ремонт triton.ptxas на Kaggle

Использование в Kaggle Notebook:
    %cd /kaggle/working
    !python instal/quick_triton_fix.py
"""

import os
import sys
import subprocess

# Добавляем текущую директорию в PATH для импорта kaggle_env
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from instal.kaggle_env import (
    VENV_DIR, PYTHON_VERSION, VENV_PYTHON,
    _repair_triton_perms, ensure_triton_works,
    step, log, warn
)

def diagnose_triton():
    """Диагностирует состояние triton."""
    step("Диагностика triton")
    
    ptxas_path = os.path.join(VENV_DIR, "lib", f"python{PYTHON_VERSION}",
                              "site-packages", "triton", "backends", "nvidia", "bin", "ptxas")
    
    log(f"Путь ptxas: {ptxas_path}")
    
    if not os.path.exists(ptxas_path):
        warn("ptxas НЕ НАЙДЕН — triton не установлен")
        return False
    
    log(f"ptxas найден: {os.path.exists(ptxas_path)}")
    log(f"ptxas исполняем: {os.access(ptxas_path, os.X_OK)}")
    
    # Проверяем права
    try:
        stat_info = os.stat(ptxas_path)
        mode = oct(stat_info.st_mode)[-3:]
        log(f"ptxas права доступа: {mode}")
    except Exception as e:
        warn(f"Ошибка при получении прав: {e}")
    
    # Пробуем запустить ptxas
    try:
        result = subprocess.run([ptxas_path, "--version"],
                              capture_output=True, text=True, timeout=5)
        if result.returncode == 0:
            log(f"ptxas запускается: ✓")
            log(f"Версия ptxas: {result.stdout.strip()[:100]}")
            return True
        else:
            warn(f"ptxas падает при запуске: {result.stderr[:200]}")
            return False
    except PermissionError as e:
        warn(f"PermissionError при запуске ptxas: {e}")
        return False
    except Exception as e:
        warn(f"Ошибка при запуске ptxas: {e}")
        return False

def main():
    step("ComfyUI Triton Quick Fix")
    
    # Диагностируем до ремонта
    log("\n📋 ДИАГНОСТИКА ДО РЕМОНТА:")
    before = diagnose_triton()
    
    if before:
        log("\n✅ triton.ptxas уже работает — ремонт не требуется")
        return 0
    
    # Чиним
    log("\n🔧 ЗАПУСК РЕМОНТА:")
    _repair_triton_perms()
    
    # Проверяем после ремонта
    log("\n📋 ДИАГНОСТИКА ПОСЛЕ РЕМОНТА:")
    after = diagnose_triton()
    
    if after:
        log("\n✅ triton.ptxas успешно починен!")
        return 0
    else:
        warn("\n⚠️ Ремонт права не помог — включаю TRITON_INTERPRET_MODE")
        ensure_triton_works()
        log("\n✅ Включен режим TRITON_INTERPRET_MODE=1 (медленнее, но работает)")
        return 1

if __name__ == "__main__":
    sys.exit(main())
