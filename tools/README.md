# tools

Скрипты, которыми сделаны промо-материалы. Все они открывают игру по адресу
`http://localhost:8765/index.html`, поэтому сначала запусти из корня репозитория:

```
python3 -m http.server 8765
```

| Файл | Что делает |
|---|---|
| `trailer-capture.js` | Снимает трейлер 1080×1920: подменяет `performance.now` и `requestAnimationFrame`, проигрывает скриптованные сцены кадр за кадром и отдаёт JPEG-кадры в ffmpeg. `node trailer-capture.js preview` сохраняет только контрольные кадры. |
| `trailer-music.py` | Синтезирует музыку трейлера (NumPy + SciPy) в `music.wav`. |
| `cover-render.js` | Рисует обложку 630×500 и баннер 1920×1080 функциями отрисовки игры. |
| `posters-render.js` | Рисует постеры: скины, враги, улучшения, «Как играть», превью для соцсетей, иконку. |

Нужны Node.js с Playwright, ffmpeg и Python 3 с NumPy и SciPy. Пути выходных файлов
внутри скриптов относительные: запускай их из пустой рабочей папки.

Сборку трейлера из готовых сцен и звука делают две команды ffmpeg:

```
ffmpeg -f concat -safe 0 -i list.txt -c copy video.mp4
ffmpeg -i video.mp4 -i music.wav -map 0:v -map 1:a -c:v copy -c:a aac -shortest trailer.mp4
```
