"""生成网页展示图和卡片缩略图，保留原始PNG。需要Pillow的WebP支持。"""
import json
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from PIL import Image, ImageOps

root = Path(__file__).resolve().parents[1]
jobs = json.loads((root / 'data/current-20261013/character-jobs.json').read_text(encoding='utf-8'))

def encode(job):
    original = root / 'dist' / job['imagePath']
    with Image.open(original) as source:
        source = source.convert('RGBA')
        result = {'id': job['id'], 'originalBytes': original.stat().st_size}
        for key, suffix, size, quality in [('portrait', '', 1280, 82), ('thumbnail', '-thumb', 640, 76)]:
            output = original.with_name(original.stem + suffix + '.webp')
            optimized = ImageOps.contain(source, (size, size), Image.Resampling.LANCZOS)
            optimized.save(output, 'WEBP', quality=quality, method=6, exact=True)
            with Image.open(output) as check:
                if check.mode != 'RGBA' or check.getchannel('A').getextrema() != (0, 255):
                    raise ValueError(f'Transparency lost: {output}')
            result[key] = output.relative_to(root / 'dist').as_posix()
            result[key + 'Bytes'] = output.stat().st_size
            result[key + 'Width'], result[key + 'Height'] = optimized.size
        return result

with ThreadPoolExecutor(max_workers=4) as pool:
    results = []
    for result in pool.map(encode, [job for job in jobs if job.get('imagePath')]):
        results.append(result)
        if len(results) % 20 == 0:
            print(f'Optimized {len(results)} portraits', flush=True)

manifest = root / 'data/current-20261013/web-portraits.json'
manifest.write_text(json.dumps(results, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
summary = {key: sum(row[key] for row in results) for key in ['originalBytes', 'portraitBytes', 'thumbnailBytes']}
summary['count'] = len(results)
summary['detailReductionPercent'] = round((1 - summary['portraitBytes'] / summary['originalBytes']) * 100, 1)
summary['cardReductionPercent'] = round((1 - summary['thumbnailBytes'] / summary['originalBytes']) * 100, 1)
print(json.dumps(summary, ensure_ascii=False), flush=True)
