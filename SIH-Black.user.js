// ==UserScript==
// @name         SIH Black
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  Обходит проверку подписки SIH.Black для Steam Inventory Helper. Автоматически перехватывает проверку подписки и возвращает успешный ответ.
// @author       Gariloz
// @match        https://steamcommunity.com/*
// @match        https://store.steampowered.com/*
// @match        https://*.steamcommunity.com/*
// @match        https://*.steampowered.com/*
// @grant        none
// @updateURL    https://github.com/Gariloz/SIH-Black/raw/main/SIH-Black.user.js
// @downloadURL  https://github.com/Gariloz/SIH-Black/raw/main/SIH-Black.user.js
// ==/UserScript==

(function() {
    'use strict';

    // Константы
    const SIHID = 'cmeakgjggjdlcpncigglobpjbkabhmjl';
    const SUBSCRIPTION_CHECK_TYPE = 'BACKGROUND_CHECK_SUBSCRIBE_ADS';
    const CHECK_INTERVAL = 200;
    const MAX_CHECK_TIME = 60000;
    const SUCCESS_RESPONSE = { success: true };

    // Флаг успешной установки перехвата
    let interceptionInstalled = false;

    // Универсальная функция для установки перехвата на любом объекте chrome
    function setupInterceptionOnChrome(chromeObj) {
        try {
            // Проверка наличия необходимых объектов
            if (!chromeObj || 
                !chromeObj.runtime || 
                typeof chromeObj.runtime.sendMessage !== 'function') {
                return false;
            }

            // Проверяем, не перехватывали ли мы уже
            if (chromeObj.runtime.sendMessage._sihBypassInstalled) {
                return true;
            }

            const orig = chromeObj.runtime.sendMessage;
            
            // Переопределяем функцию sendMessage
            chromeObj.runtime.sendMessage = function(id, payload, callback) {
                // Если это не наше расширение, вызываем оригинальную функцию
                if (id !== SIHID) {
                    return orig.apply(this, arguments);
                }

                // Проверяем тип запроса
                const isSubscriptionCheck = payload && 
                    typeof payload === 'object' && 
                    payload.type === SUBSCRIPTION_CHECK_TYPE;

                // Если это проверка подписки, возвращаем успешный ответ
                if (isSubscriptionCheck) {
                    if (typeof callback === 'function') {
                        callback(SUCCESS_RESPONSE);
                    }
                    return;
                }

                // Для всех остальных запросов вызываем оригинальную функцию
                return orig.apply(this, arguments);
            };

            // Помечаем функцию как перехваченную
            chromeObj.runtime.sendMessage._sihBypassInstalled = true;
            return true;
        } catch (e) {
            // Игнорируем ошибки при установке перехвата
            return false;
        }
    }

    // Функция для поиска и перехвата всех возможных chrome объектов
    function interceptAllChromeInstances() {
        if (interceptionInstalled) {
            return true;
        }

        const chromeObjects = [];

        // Собираем все возможные chrome объекты
        if (typeof chrome !== 'undefined' && chrome) {
            chromeObjects.push(chrome);
        }
        if (typeof window !== 'undefined' && window.chrome) {
            chromeObjects.push(window.chrome);
        }
        if (typeof self !== 'undefined' && self.chrome) {
            chromeObjects.push(self.chrome);
        }

        // Пытаемся установить перехват на каждом объекте
        for (let i = 0; i < chromeObjects.length; i++) {
            if (setupInterceptionOnChrome(chromeObjects[i])) {
                interceptionInstalled = true;
                return true;
            }
        }

        return false;
    }

    // Запускаем перехват сразу
    interceptAllChromeInstances();

    // Периодически проверяем появление chrome.runtime (на случай если расширение загружается позже)
    let checkInterval = setInterval(() => {
        if (interceptionInstalled || interceptAllChromeInstances()) {
            // Если перехват установлен, останавливаем проверку
            if (checkInterval) {
                clearInterval(checkInterval);
                checkInterval = null;
            }
        }
    }, CHECK_INTERVAL);

    // Останавливаем проверку через максимальное время
    setTimeout(() => {
        if (checkInterval) {
            clearInterval(checkInterval);
            checkInterval = null;
        }
    }, MAX_CHECK_TIME);

    // Перехватываем при загрузке DOM
    if (typeof document !== 'undefined') {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', interceptAllChromeInstances, { once: true });
        }
    }

    // Перехватываем при полной загрузке страницы
    if (typeof window !== 'undefined') {
        window.addEventListener('load', interceptAllChromeInstances, { once: true });
    }

})();
