/* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

;(function($) {

    'use strict';

    var $main = $('main');
    var $container = $('.tab-panel');
    var $smsForm = $('#sms-form');
    var $smsFormHeading = $('.sms-form-wrapper > h3');
    var $smsThankYou = $('#sms-form-thank-you');
    var $smsInput = $('#number');

    var $emailForm = $('#newsletter-form');
    var $emailThankYou = $('#newsletter-form-thankyou');
    var $emailInput = $('#id_email');

    $('.toggle > ul > li > a').on('click', function(e) {
        e.preventDefault();
        var id = e.target.id;

        // set the min height of the container should the newsletter
        // have been expanded to avoid content jump.
        $container.css('min-height', $container.height());

        if (id === 'tab-sms') {
            $main.attr('data-active', 'sms');
        } else if (id = 'tab-email') {
            $main.attr('data-active', 'email');
        }
    });

    $smsForm.on('submit', function(e) {
        e.preventDefault();

        var $self = $(this);
        var action = $self.attr('action');
        var $spinnerTarget = $('#sms-spinner');
        var $smsFormWrapper = $('.sms-form-wrapper');
        var spinner = new Spinner({
            lines: 12, // The number of lines to draw
            length: 4, // The length of each line
            width: 2, // The line thickness
            radius: 4, // The radius of the inner circle
            corners: 0, // Corner roundness (0..1)
            rotate: 0, // The rotation offset
            direction: 1, // 1: clockwise, -1: counterclockwise
            color: '#000', // #rgb or #rrggbb or array of colors
            speed: 1, // Rounds per second
            trail: 60, // Afterglow percentage
            shadow: false, // Whether to render a shadow
            hwaccel: true // Whether to use hardware acceleration
        });

        // have to collect data before disabling inputs
        var formData = $self.serialize();
        disableForm();

        $.post(action, formData)
            .done(function(data) {
                enableForm();
                if (data.success) {
                    $smsFormHeading.hide();
                    $self.hide();
                    $smsThankYou.show();
                } else if (data.error) {
                    $self.find('.error').html(data.error).show();
                }
            })
            .fail(function() {
                enableForm();
                $self.find('.error').show();
            });

        function disableForm() {
            $smsFormWrapper.addClass('loading');
            $self.find('input').prop('disabled', true);
            spinner.spin($spinnerTarget.show()[0]);
        }

        function enableForm() {
            $smsFormWrapper.removeClass('loading');
            $self.find('input').prop('disabled', false);
            spinner.stop();
            $spinnerTarget.hide();
        }
    });

    $smsThankYou.find('.send-another').on('click', function(e) {
        e.preventDefault();
        $smsInput.val('');
        $smsForm.find('.error').hide();
        $smsThankYou.hide();
        $smsFormHeading.show();
        $smsForm.show();
        $smsInput.focus();
    });

    $emailThankYou.find('.send-another').on('click', function(e) {
        e.preventDefault();
        $emailInput.val('');
        $emailForm.find('.error').hide();
        $emailThankYou.hide();
        $emailForm.show();
        $emailInput.focus();
    })


})(window.jQuery);
