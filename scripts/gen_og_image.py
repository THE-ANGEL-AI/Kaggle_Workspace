"""
OG-image generator for THE ANGEL AI Kaggle Workspace FreeGPU.
1200×630 PNG в cyberpunk-стиле: тёмный фон, neon-cyan/violet, градиентный текст.
"""
from PIL import Image, ImageDraw, ImageFilter, ImageFont
import os

W, H = 1200, 630
OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'assets', 'og-image.png')
OUT = os.path.normpath(OUT)

# Цветовая палитра сайта
BG_DEEP   = (10, 10, 30)        # #0A0A1E
BG_PANEL  = (20, 15, 40)        # подложка
CYAN      = (0, 245, 255)       # #00F5FF
VIOLET    = (123, 97, 255)      # #7B61FF
PURPLE    = (168, 85, 247)      # #A855F7
MAGENTA   = (255, 0, 122)       # #FF007A
GREEN     = (0, 255, 179)       # #00FFB3
WHITE     = (245, 247, 255)
DIM       = (180, 184, 212)

# Загрузка шрифтов с fallback на PIL default
def load_font(size, bold=False):
    candidates = [
        r'C:\Windows\Fonts\segoeuib.ttf' if bold else r'C:\Windows\Fonts\segoeui.ttf',
        r'C:\Windows\Fonts\arialbd.ttf' if bold else r'C:\Windows\Fonts\arial.ttf',
        '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf' if bold else '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
    ]
    for c in candidates:
        if os.path.exists(c):
            try:
                return ImageFont.truetype(c, size)
            except Exception:
                continue
    return ImageFont.load_default()

font_micro   = load_font(18)
font_logo    = load_font(22, bold=True)
font_h1      = load_font(72, bold=True)
font_h2      = load_font(34, bold=True)
font_body    = load_font(24)
font_chip    = load_font(18, bold=True)
font_url     = load_font(20)

# 1. Фон с диагональным градиентом
img = Image.new('RGB', (W, H), BG_DEEP)
draw = ImageDraw.Draw(img, 'RGBA')

# Диагональный градиент через прямоугольники
for y in range(H):
    t = y / H
    r = int(BG_DEEP[0] + (BG_PANEL[0] - BG_DEEP[0]) * t * 0.6)
    g = int(BG_DEEP[1] + (BG_PANEL[1] - BG_DEEP[1]) * t * 0.6)
    b = int(BG_DEEP[2] + (BG_PANEL[2] - BG_DEEP[2]) * t * 0.6)
    draw.line([(0, y), (W, y)], fill=(r, g, b))

# 2. Ambient glow circles (cyan, violet, magenta) — НЕ перекрывают текст
def radial_glow(cx, cy, radius, color, alpha_max=80):
    """Создаёт мягкое радиальное свечение через альфа-слои."""
    for r in range(radius, 0, -8):
        a = int(alpha_max * (r / radius) ** 2)
        draw.ellipse(
            [cx - r, cy - r, cx + r, cy + r],
            fill=color + (a,),
        )

# Круги в нижних углах — не мешают заголовку
radial_glow(120, H - 80, 280, CYAN, 55)
radial_glow(W - 100, H - 120, 340, VIOLET, 65)
radial_glow(W - 200, 60, 140, MAGENTA, 40)

# 3. Тонкая сетка (grid pattern)
grid_color = (*WHITE, 12)
spacing = 40
for x in range(0, W, spacing):
    draw.line([(x, 0), (x, H)], fill=grid_color, width=1)
for y in range(0, H, spacing):
    draw.line([(0, y), (W, y)], fill=grid_color, width=1)

# 4. Top label "THE ANGEL AI" + dot
# Dot
dot_x, dot_y = 80, 80
draw.ellipse([dot_x - 8, dot_y - 8, dot_x + 8, dot_y + 8], fill=CYAN)
# Glow around dot
for r in range(20, 8, -2):
    a = int(80 * (1 - r / 20))
    draw.ellipse([dot_x - r, dot_y - r, dot_x + r, dot_y + r], fill=CYAN + (a,))

draw.text((100, 65), 'THE ANGEL AI', font=font_logo, fill=CYAN)
draw.text((100, 95), 'Laboratory of the Future', font=font_micro, fill=DIM)

# Top-right tag
tag_text = 'PHASE 16 — SOCIAL PROOF'
tw = draw.textlength(tag_text, font=font_chip)
tag_x = W - tw - 80
tag_y = 70
draw.rounded_rectangle(
    [tag_x - 18, tag_y - 8, tag_x + tw + 18, tag_y + 36],
    radius=18,
    outline=CYAN + (180,),
    width=2,
)
draw.text((tag_x, tag_y), tag_text, font=font_chip, fill=CYAN)

# 5. Main title "ComfyUI на 2× Tesla T4 бесплатно"
title1 = 'ComfyUI на'
title2 = '2× Tesla T4'

# Gradient text (cyan → violet → purple) — рисуем посимвольно с радугой
def draw_gradient_text(text, x, y, font, colors, step=2):
    """Рисует текст посимвольно, перебирая цвета градиента слева направо."""
    bbox = draw.textbbox((0, 0), text, font=font)
    text_w = bbox[2] - bbox[0]
    n = len(colors) - 1
    cx = x
    for i, ch in enumerate(text):
        # Цвет по позиции символа
        t = i / max(len(text) - 1, 1)
        # Интерполяция между colors
        seg = t * n
        idx = int(seg)
        f = seg - idx
        if idx >= n:
            idx, f = n - 1, 1.0
        c = tuple(int(colors[idx][k] + (colors[idx + 1][k] - colors[idx][k]) * f) for k in range(3))
        draw.text((cx, y), ch, font=font, fill=c)
        ch_bbox = draw.textbbox((0, 0), ch, font=font)
        cx += ch_bbox[2] - ch_bbox[0]

# Title 1 — белый/cyan
draw.text((80, 200), title1, font=font_h1, fill=WHITE)

# Title 2 — градиент
bbox = draw.textbbox((0, 0), title1, font=font_h1)
title2_y = 200 + (bbox[3] - bbox[1]) + 8
draw_gradient_text(title2, 80, title2_y, font_h1, [CYAN, VIOLET, PURPLE])

# Подзаголовок
sub = 'бесплатно — без своего GPU, без оплаты облака.'
draw.text((80, title2_y + 110), sub, font=font_h2, fill=WHITE)

# Chips с моделями
chips = ['Flux2 GGUF', 'LTX 2.3', 'TTS', '2× T4 GPU']
chip_y = title2_y + 175
chip_x = 80
for ch in chips:
    cw = draw.textlength(ch, font=font_chip)
    pad = 16
    draw.rounded_rectangle(
        [chip_x, chip_y, chip_x + cw + pad * 2, chip_y + 36],
        radius=18,
        outline=PURPLE + (140,),
        width=2,
    )
    draw.text((chip_x + pad, chip_y + 6), ch, font=font_chip, fill=PURPLE)
    chip_x += cw + pad * 2 + 12

# 6. Bottom URL + GitHub link — добавлен полупрозрачный bg для контраста с glow
divider_y = H - 80
draw.line([(80, divider_y), (W - 80, divider_y)], fill=(*WHITE, 50), width=1)

# Полупрозрачная подложка под текст, чтобы он читался на фоне glow
draw.rectangle([0, divider_y, W, H], fill=(10, 10, 30, 150))

url_text = 'github.com/THE-ANGEL-AI/Kaggle_Workspace_FreeGPU'
draw.text((80, divider_y + 18), url_text, font=font_url, fill=WHITE)
draw.text((80, divider_y + 46), 'THE-ANGEL-AI  ·  Kaggle Workspace FreeGPU  ·  2026', font=font_micro, fill=DIM)

# Bottom-right gradient circle decoration
decor_cx, decor_cy = W - 120, H - 140
for r in [50, 38, 26, 14]:
    a = int(140 * (1 - r / 50))
    draw.ellipse(
        [decor_cx - r, decor_cy - r, decor_cx + r, decor_cy + r],
        outline=PURPLE + (a,),
        width=2,
    )
draw.ellipse(
    [decor_cx - 7, decor_cy - 7, decor_cx + 7, decor_cy + 7],
    fill=PURPLE,
)

# Сохранение
os.makedirs(os.path.dirname(OUT), exist_ok=True)
img.save(OUT, 'PNG', optimize=True)
print(f'Saved: {OUT}')
print(f'Size: {os.path.getsize(OUT) / 1024:.1f} KB')