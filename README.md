# LinkLounge
Social network

# Опис
Цей проєкт реалізує функціонал для роботи з груповими чатами, особистими повідомленнями користувачів та профілем користувача.

# Figma 
https://www.figma.com/design/L8WzDSrsrcwEBMmRg1b7lc/LinkLounge?node-id=6-3&t=BQT9GOW0w3f3Ti8M-1

## Зміст
- [Технології](#технологии)
- [Початок роботи](#початок-роботи)
- [Команда проекта](#команда-проекта)
- [Контакти](#контакти)


## Технолології
- **HTML/CSS**: для створення інтерфейсів користувача.
- **Python/DJANGO**: серверна частина
- **JavaScript**: використовується для інтерактивності сторінок та реалізації WebSocket для чатів.
- **WebSocket**: ротокол передачі даних в реальному часі.
- **SQLite3/MySQL**: бази даних

## Початок роботи
1. Спочатку склонуйте репозиторій:
   ```
   git clone https://github.com/MaxSlipchuk/LinkLounge
   ```
2. Перейдіть у директорію проекту:
   ```
   cd LinkLounge
   ```
3. Встановіть залежності:
   - django: фреймворк для роботи з веб-додатком (https://www.djangoproject.com/).
    ```
    pip install django
    ```
   - channels: бібліотека для Django, яка надає підтримку асинхронних запитів, веб-сокетів у реального часі (https://github.com/django/channels).
   ```
   pip install channels
   ```
   - daphne: основна функція - це обробка HTTP і WebSocket-запитів в асинхронному режимі для Django додатків, які використовують Channels(https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/daphne/).
   ```
   pip install daphne
   ```

## Команда проекта
- Max Slipchuk
https://github.com/MaxSlipchuk 
- Maksym Hryhorenko
https://github.com/Max02039 
- Drahnieva Mariia
https://github.com/DragnevaMaria
- Tymchenko Rodion
https://github.com/Rodion096

## Контакти
Якщо у вас є питання щодо проекту, будь ласка, зв'яжіться зі мною за адресою електронної пошти nice.slipchukmax@gmail.com або через мою сторінку в GitHub: https://github.com/MaxSlipchuk

