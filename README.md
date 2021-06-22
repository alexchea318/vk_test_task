# Тестовое задание для ВКонтакте
### Автор: Чеченев Александр
#### Ссылка на сайт-превью: https://alexchea318.github.io/vk_test_task/
#### Выполнено оба задания
Использовался только чистый JS без фреймворков

❗ Сайт протетсирован в браузерах Firefox, Edge, Chrome, Safari(iphone), Chrome Mobile(Android). Используются CSS свойства, работа а старых браузерах может быть некорректной 

## Фичи
* ### Основные
1. Макет полностью адаптивный: переключение на мобильную версию происходит автоматически
2. Для компьютера список эмодзи реализован в виде всплывающего окна при наведении на иконку выбора эмодзи (как в веб-версии ВК), список появляется в виде всплывающего окна с аблолютным позицианированием
3. Для мобильных устройств на иконку требуется нажать, список заменяет собой клавиатуру (как в приложении ВК)
4. В истории запоминаются последние 25 эмодзи. Запоминаются только **различные в хронологическом порядке**. При этом, если вставлять эмодзи через историю, список запомненных эмодзи не меняется
5. Подтсветка хештегов, ссылок, почт и упоминай реализована с помощью **регулярных выражений** динамически в режиме реального времени
6. Присутствует **проврека на корректность**: например, если из почты удалить собаку, подсветка исчезнет.
7. При открытии сайта с компьютера можно сразу начинать писать сообщение, так как фокус автоматически устанавливается на поле ввода
8. Если отправить только 1 эмодзи, то он будет увеличен (как в приложении ВК)
9. В хештегах и ссылках могут быть русские буквы, в почтах и упоминаниях нет.
10. Подствечивается только хештег или упоминание а не все слово. Например, если ввести 1@sasha - подстветится только @sasha.

* ### Второстепенные
1. Отключено автоувеличиение страницы при наведении на форму ввода в браузере Safari
2. Авторесайз поля ввода осуществляется при помощи span contenteditable, который выполянет функцию textbox. Такое решение намного плавнее, чем нативно увлеличивать textarea с помощью js
3. Поле ввода растёт до 10 строк, потом включается overflow scroll
4. После отправки сообщения экранная клавиатура не убирается, фoкус остается на поле ввода
5. Иконка отправки анимируется при переключении с иконки записи голоса только 1 раз, чтобы не отвлекать пользователя
6. После отправки сообщения скролл всегда пролистывается вниз
7. Время сообщений в формате 21:02 а не 21:2
8. В мобильной версии можно одноврменно открыть клавиатуру и список эмодзи, если сначала открыть эмодзи, а потом нажать на поле ввода
9. Эмодзи загружаются ассинхронно и не тормозят загрузку страницы 
11. Если закрыть список на истории эмодзи, то список при повторном открытии будет переключен на список эмодзи
12. Ширина задается нативно только текстовой форме, все остальное позиционирование адаптивное
13. Подстветка остается в сообщениях
14. Эмодзи и сообщения реализованы с помощью template, что улучшает читаемость кода
15. Все скроллбары стилизованы, у них убраны стрелки управления
17. Макет легко изменяем, так как основан на CSS переменных
18. В поле ввода можно вставлять скриншоты через cntrl+v (как в мобильной версии).
19. При вставке форматированного html остается только текст - теги и стили убираются
20. Сообщения появляются с плавной анимацией
21. Для мобильной версии область тапа по эмодзи увеличивается
22. После отправки сообщения, если открыт список эмодзи, происходит переключение на клавиатуру

## Скриншоты
##### *Пример подсветки элементов*
![Пример подстветки кода](/images/lightning.png)
### 

##### *Мобильная версия*
![Мобильная версия](/images/mobile.png)
### 

##### *Пк версия*
![ПК версия](/images/pc.png)

##### *Интерфейс удобен даже на iphone 5*
![Маленькая версия](/images/iphone.png)

