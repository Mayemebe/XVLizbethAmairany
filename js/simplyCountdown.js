/*!
 * Proyecto: simply-countdown
 * Archivo: simplyCountdown
 * Fecha: 27/06/2015
 * Licencia: MIT
 * Versión: 1.3.2
 * Autor: Vincent Loy <vincent.loy1@gmail.com>
 * Colaboradores:
 *  - Justin Beasley <JustinB@harvest.org>
 *  - Nathan Smith <NathanS@harvest.org>
 */
/*global window, document*/
(function (exports) {
    'use strict';

    var // funciones
        extender,
        crearElementos,
        crearContadorElt,
        simplementeCuentaRegresiva;

    /**
     * Función que fusiona los parámetros del usuario con los predeterminados.
     * @param out
     * @returns {*|{}}
     */
    extender = function (out) {
        var i,
            obj,
            key;
        out = out || {};

        for (i = 1; i < arguments.length; i += 1) {
            obj = arguments[i];

            if (obj) {
                for (key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        if (typeof obj[key] === 'object') {
                            extender(out[key], obj[key]);
                        } else {
                            out[key] = obj[key];
                        }
                    }
                }
            }
        }

        return out;
    };

    /**
     * Función que crea una sección de cuenta regresiva
     * @param cuentaRegresiva
     * @param parametros
     * @param typeClass
     * @returns {{full: (*|Element), amount: (*|Element), word: (*|Element)}}
     */
    crearContadorElt = function (cuentaRegresiva, parametros, typeClass) {
        var innerSectionTag,
            sectionTag,
            amountTag,
            wordTag;

        sectionTag = document.createElement('div');
        amountTag = document.createElement('span');
        wordTag = document.createElement('span');
        innerSectionTag = document.createElement('div');

        innerSectionTag.appendChild(amountTag);
        innerSectionTag.appendChild(wordTag);
        sectionTag.appendChild(innerSectionTag);

        sectionTag.classList.add(parametros.sectionClass);
        sectionTag.classList.add(typeClass);
        amountTag.classList.add(parametros.amountClass);
        wordTag.classList.add(parametros.wordClass);

        cuentaRegresiva.appendChild(sectionTag);

        return {
            full: sectionTag,
            amount: amountTag,
            word: wordTag
        };
    };

    /**
     * Función que crea elementos DOM de cuenta regresiva completa llamando a crearContadorElt
     * @param parametros
     * @param cuentaRegresiva
     * @returns {{days: (*|Element), hours: (*|Element), minutes: (*|Element), seconds: (*|Element)}}
     */
    crearElementos = function (parametros, cuentaRegresiva) {
        var spanTag;

        if (!parametros.inline) {
            return {
                days: crearContadorElt(cuentaRegresiva, parametros, 'simply-days-section'),
                hours: crearContadorElt(cuentaRegresiva, parametros, 'simply-hours-section'),
                minutes: crearContadorElt(cuentaRegresiva, parametros, 'simply-minutes-section'),
                seconds: crearContadorElt(cuentaRegresiva, parametros, 'simply-seconds-section')
            };
        }

        spanTag = document.createElement('span');
        spanTag.classList.add(parametros.inlineClass);
        return spanTag;
    };

    /**
     * simplementeCuentaRegresiva, crea y muestra la cuenta regresiva.
     * @param elt
     * @param args (parámetros)
     */
    simplementeCuentaRegresiva = function (elt, args) {
        var parametros = extender({
                year: 2024,
                month: 7,
                day: 13,
                hours: 0,
                minutes: 0,
                seconds: 0,
                words: {
                    days: 'día',
                    hours: 'hora',
                    minutes: 'minuto',
                    seconds: 'segundo',
                    pluralLetter: 's'
                },
                plural: true,
                inline: false,
                enableUtc: true,
                onEnd: function () {
                    return;
                },
                refresh: 1000,
                inlineClass: 'simply-countdown-inline',
                sectionClass: 'simply-section',
                amountClass: 'simply-amount',
                wordClass: 'simply-word',
                zeroPad: false
            }, args),
            interval,
            targetDate,
            targetTmpDate,
            now,
            nowUtc,
            secondsLeft,
            days,
            hours,
            minutes,
            seconds,
            cd = document.querySelectorAll(elt);

        targetTmpDate = new Date(
            parametros.year,
            parametros.month - 1,
            parametros.day,
            parametros.hours,
            parametros.minutes,
            parametros.seconds
        );

        if (parametros.enableUtc) {
            targetDate = new Date(
                targetTmpDate.getUTCFullYear(),
                targetTmpDate.getUTCMonth(),
                targetTmpDate.getUTCDate(),
                targetTmpDate.getUTCHours(),
                targetTmpDate.getUTCMinutes(),
                targetTmpDate.getUTCSeconds()
            );
        } else {
            targetDate = targetTmpDate;
        }

        Array.prototype.forEach.call(cd, function (cuentaRegresiva) {
            var cuentaRegresivaCompleta = crearElementos(parametros, cuentaRegresiva),
                refresh;

            refresh = function () {
                var dayWord,
                    hourWord,
                    minuteWord,
                    secondWord;

                now = new Date();
                if (parametros.enableUtc) {
                    nowUtc = new Date(now.getFullYear(), now.getMonth(), now.getDate(),
                        now.getHours(), now.getMinutes(), now.getSeconds());
                    secondsLeft = (targetDate - nowUtc.getTime()) / 1000;

                } else {
                    secondsLeft = (targetDate - now.getTime()) / 1000;
                }

                if (secondsLeft > 0) {
                    days = parseInt(secondsLeft / 86400, 10);
                    secondsLeft = secondsLeft % 86400;

                    hours = parseInt(secondsLeft / 3600, 10);
                    secondsLeft = secondsLeft % 3600;

                    minutes = parseInt(secondsLeft / 60, 10);
                    seconds = parseInt(secondsLeft % 60, 10);
                } else {
                    days = 0;
                    hours = 0;
                    minutes = 0;
                    seconds = 0;
                    window.clearInterval(interval);
                    parametros.onEnd();
                }

                if (parametros.plural) {
                    dayWord = days > 1
                        ? parametros.words.days + parametros.words.pluralLetter
                        : parametros.words.days;

                    hourWord = hours > 1
                        ? parametros.words.hours + parametros.words.pluralLetter
                        : parametros.words.hours;

                    minuteWord = minutes > 1
                        ? parametros.words.minutes + parametros.words.pluralLetter
                        : parametros.words.minutes;

                    secondWord = seconds > 1
                        ? parametros.words.seconds + parametros.words.pluralLetter
                        : parametros.words.seconds;

                } else {
                    dayWord = parametros.words.days;
                    hourWord = parametros.words.hours;
                    minuteWord = parametros.words.minutes;
                    secondWord = parametros.words.seconds;
                }

                /* muestra una cuenta regresiva en línea en una etiqueta span */
                if (parametros.inline) {
                    cuentaRegresiva.innerHTML =
                        days + ' ' + dayWord + ', ' +
                        hours + ' ' + hourWord + ', ' +
                        minutes + ' ' + minuteWord + ', ' +
                        seconds + ' ' + secondWord + '.';

                } else {
                    cuentaRegresivaCompleta.days.amount.textContent = (parametros.zeroPad && days.toString().length < 2 ? '0' : '') + days;
                    cuentaRegresivaCompleta.days.word.textContent = dayWord;

                    cuentaRegresivaCompleta.hours.amount.textContent = (parametros.zeroPad && hours.toString().length < 2 ? '0' : '') + hours;
                    cuentaRegresivaCompleta.hours.word.textContent = hourWord;

                    cuentaRegresivaCompleta.minutes.amount.textContent = (parametros.zeroPad && minutes.toString().length < 2 ? '0' : '') + minutes;
                    cuentaRegresivaCompleta.minutes.word.textContent = minuteWord;

                    cuentaRegresivaCompleta.seconds.amount.textContent = (parametros.zeroPad && seconds.toString().length < 2 ? '0' : '') + seconds;
                    cuentaRegresivaCompleta.seconds.word.textContent = secondWord;
                }
            };

            // Actualiza inmediatamente para evitar un parpadeo de contenido sin estilo
            refresh();
            interval = window.setInterval(refresh, parametros.refresh);
        });
    };

    exports.simplyCountdown = simplementeCuentaRegresiva;
}(window));

/*global $, jQuery, simplementeCuentaRegresiva*/
if (window.jQuery) {
    (function ($, simplementeCuentaRegresiva) {
        'use strict';

        function simplyCountdownify(el, options) {
            simplementeCuentaRegresiva(el, options);
        }

        $.fn.simplyCountdown = function (options) {
            return simplyCountdownify(this.selector, options);
        };
    }(jQuery, simplementeCuentaRegresiva));
}
