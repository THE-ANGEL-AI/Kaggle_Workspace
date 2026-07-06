#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Тестовый скрипт для проверки функции _repair_triton_perms()
"""

import os
import sys

# Добавляем текущую директорию в PATH для импорта kaggle_env
sys.path.insert(0, os.path.dirname(__file__))

from kaggle_env import VENV_DIR, PYTHON_VERSION, _repair_triton_perms, step, log, warn

def main():
    step("Тестирование ремонта прав доступа triton")
    
    triton_dir = os.path.join(VENV_DIR, "lib", f"python{PYTHON_VERSION}",
                              "site-packages", "triton")
    
    log(f"Проверяю директорию: {triton_dir}")
    
    if not os.path.isdir(triton_dir):
        warn(f"Директория triton не найдена: {triton_dir}")
        warn("Triton еще не установлен или venv не создан")
        return
    
    # Проверяем ptxas
    ptxas_path = os.path.join(triton_dir, "backends", "nvidia", "bin", "ptxas")
    if os.path.isfile(ptxas_path):
        is_exec = os.access(ptxas_path, os.X_OK)
        log(f"ptxas найден: {ptxas_path}")
        log(f"ptxas исполняем: {is_exec}")
        if not is_exec:
            warn(f"ptxas БЕЗ прав исполнения! Нужен ремонт.")
    else:
        log(f"ptxas не найден по пути: {ptxas_path}")
    
    # Ищем все .so и бинарники
    so_count = 0
    binary_count = 0
    for root, _dirs, files in os.walk(triton_dir):
        for f in files:
            if f.endswith(".so"):
                so_count += 1
            elif not os.path.splitext(f)[1]:
                binary_count += 1
    
    log(f"Найдено .so файлов: {so_count}")
    log(f"Найдено бинарников (без расширения): {binary_count}")
    
    # Вызываем ремонт
    log("Запускаю ремонт...")
    _repair_triton_perms()
    log("Ремонт завершен")

if __name__ == "__main__":
    main()
