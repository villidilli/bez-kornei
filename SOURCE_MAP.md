# Карта проекта для продолжения из GitHub

Дата: 22 ноября 2026. Сначала читать этот файл, PROJECT_STATUS.md и brand/README.md. Эта копия готовится непосредственно из актуальной Windows-папки проекта.

## Текущий сайт

- bez-korney-preview/index.html — собранная главная; works.html — портфолио.
- sketches/bez-lounge-hero.html — первый экран.
- sketches/bez-why-artificial.html — преимущества.
- sketches/bez-selected-works.html — работы.
- sketches/bez-design-partners.html — дизайнеры и архитекторы.
- sketches/bez-process.html — «Как всё складывается».
- sketches/bez-cost-factors.html — стоимость.
- sketches/bez-questions.html — FAQ, пять вопросов.
- sketches/bez-contacts.html — контакты, возврат и подвал.

Править исходники, затем выполнять `python assemble-preview.py` (либо `py -3 assemble-preview.py`). Не править только собранный index.html. Некоторые стили фрагментов находятся после закрывающего section: сохранять весь файл.

assembly.css, assembly.js, cta.css и brand-intro.js редактируются отдельно в bez-korney-preview; сборщик их не перезаписывает. Форма кнопок общая — не вводить локальные масштабы. Ресурсы сайта находятся в bez-korney-preview/assets/.

## Логотипы и мерч

Папка brand/: approved — утверждённые векторы сайта, merch — знак для мерча от 22 ноября, explorations — разработки, motion — анимация. Точную карту и статусы смотреть в brand/README.md. Не заменять логотип эскизом из истории.

## Последние решения

- Одиннадцать листьев вместо цифр в преимуществах, процессе, стоимости и у дизайнеров.
- В FAQ нет нумерации, справа остаются плюсы. Последний вопрос — готовые комплекты растений под заказ с курьерской отправкой для самостоятельного монтажа.
- Под самый длинный ответ FAQ резервируется место: не удалять reserveAnswerSpace и пересчёт при resize.
- Исходная кнопка «Назад» справа над линией подвала, с постоянной зоной 132px; её появление не сдвигает контент.
- Рабочие экраны и логотип сохранять; не возвращать старые варианты из archive/ и bez-korney/.

## Запуск

`node serve-preview.cjs` либо `python -m http.server 8765 --bind 127.0.0.1 --directory bez-korney-preview`. На Windows также start-preview.cmd. Открыть http://127.0.0.1:8765/.

## Остальные каталоги

media/ — имеющиеся медиа; sketches/ и studio-concepts/ — исходники и эксперименты; docs/ и archive/ — история. Старые пути из документов переноса не являются рабочими путями GitHub-копии. Не загружать node_modules, .venv, .env, временные архивы и ключи. Этот репозиторий хранит код и материалы, а публикация сайта выполняется отдельно.
