/*!
 * ajaxpost.js
 * @version v1.0.0
 * @link https://github.com/Yusoo/ajaxpost
 * @author Yusoo
 * @email yusoo@qq.com
 */
(function(factory) {
    "use strict";
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
})(function($) {
    "use strict";
    var methods = {
        init: function(options) {
            return this.each(function() {
                options      = options || {};
                var pending  = false;
                var $el      = $(this);
                var settings = {
                    action: options.action || $el.attr('action'),
                    notice: options.notice || $el.data('notice') || '#notification',
                    datas: options.datas,
                    func: options.func
                };

                var $notice = $(settings.notice);

                if ($el.prop('nodeName') === 'FORM') {
                    //$el.find('.submitagent').attr('type', 'submit'); //IE9以下报错
                    $el.find('.submitagent').click(function() {
                        if ($el.find('input:submit').length) {
                            $el.find('input:submit').trigger('click');
                        } else {
                            $el.submit();
                        }
                    });

                    $el.submit(function(e) {
                        e.preventDefault();
                        post($el.serialize());
                    });
                } else {
                    post(settings.datas);
                }

                function showNotice(notice, status) {
                    if ($notice.length) {
                        $notice.removeClass().html(notice);
                        if (status) {
                            $notice.addClass(status);
                        }
                    } else {
                        if (status !== 'pending') {
                            alert(notice);
                        }
                    }
                }

                function post(postData) {
                    if (pending) {
                        return false;
                    }
                    pending = true;
                    showNotice('正在提交...', 'pending');
                    $.post(settings.action, postData)
                        .done(function(data) {
                            if (data.notice) {
                                showNotice(data.notice, data.status);
                            }
                            if (data.alert) {
                                alert(data.alert);
                            }
                            if (data.reload) {
                                location.reload();
                            }
                            if (data.reset) {
                                $el.find('input:reset').trigger('click');
                            }
                            if (data.redirect) {
                                location.href = data.redirect;
                            }
                            if (data.script) {
                                eval(data.script);
                            }
                            if (typeof settings.func === 'function') {
                                settings.func(data);
                            }
                        })
                        .fail(function() {
                            showNotice('网络错误，请稍后再试。', 'fail');
                        })
                        .always(function() {
                            pending = false;
                        });
                }
            });
        }
    };

    $.fn.ajaxpost = function(method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            console.log('Method ' + method + ' does not exist');
        }
    };
});
