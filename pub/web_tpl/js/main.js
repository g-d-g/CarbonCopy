// Manage participants.
(function () {
    var manage_participants = {
        props: {},
        init: function (props) {
            this.props = $.extend({}, this.props, props);
            return this;
        },
        load_form: function (url) {
            $this = this;
            var div = $('#manage_participants_div');
            div.load(url, function () {
                div.show();
                var options = {
                    dataType: 'json',
                    type: 'post',
                    success: $this.process_validation
                };
                $('#manage_participants_form').ajaxForm(options);
            });
        },
        process_validation: function (data) {
            switch (data.result) {
                case 'canceled':
                    break;
                case 'ok':
                    $('#participants ul').remove();
                    $('#participants').append(data.message);
                    break;
                default:
                    hide_aggressive_message();
                    alert(data.message);
                    break;
            }
            $('#manage_participants_div').hide();
        }
    };

    // Para instanciar y ejecutar constructor.
    new_manage_participants = function (props) {
        var REL_OBJ_NAME = Object.create(manage_participants);
        return REL_OBJ_NAME.init(props);
    };
})();

var manage_participants_i = new_manage_participants();
$('.man-lst').on('click', function (e) {
    manage_participants_i.load_form($(this).prop('href'));
    e.preventDefault();

    return false;
});
$('#delegate').on('click', '.pp', function () {
    $('#pa:checked').attr('checked', false);
});
$('#delegate').on('click', '#pa', function () {
    $('.pp:checked').attr('checked', false);
});

// Search
(function () {
    var search = {
        props: {},
        no_search: [9, 13, 16, 17, 18, 19, 20, 33, 34, 35, 36, 37, 38, 39, 45, 91, 92, 93, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 144, 145],
        init: function (props) {
            this.props = $.extend({}, this.props, props);
            return this;
        },
        go: function (e, q) {
            if (e.keyCode === 40) {
                $('#search_results a:first').focus();

                return false;
            }

            if (e.keyCode === 27) {
                $('#search').val('');
                $('#search').blur();
                $('#search_results').hide();

                return false;
            }

            if (this.no_search.indexOf(e.keyCode) > -1) {
                return false;
            }

            if (q.length > 1) {
                $.ajax({
                    url: site_url + 'cc/search/go/',
                    data: {'q': q},
                    success: function (result) {
                        if (result.length > 0) {
                            $('#search_results').html(result);
                            $('#search_results').show();
                        } else {
                            $('#search_results').hide();
                        }
                    }
                });
            } else {
                $('#search_results').hide();
            }
        },
        nav_result: function (e) {
            if (e.keyCode === 38) {
                e.preventDefault();
                el = $('#search_results a:focus');

                if (el.is(':first-child')) {
                    $('#search').focus();
                }

                el.parent().prev().find('a:first').focus();
            }

            if (e.keyCode === 40) {
                e.preventDefault();
                el = $('#search_results a:focus');

                el.parent().next().find('a:first').focus();
            }

            return false;
        }
    };

    // Para instanciar y ejecutar constructor.
    new_search = function (props) {
        var REL_OBJ_NAME = Object.create(search);
        return REL_OBJ_NAME.init(props);
    };
})();

var search = new_search();
$('#search').on('keyup', function (e) {
    search.go(e, $(this).val());
});
$('#search_results').on('keydown', 'a', function (e) {
    search.nav_result(e);
});

$('#move_context').on('click', function (e) {
    $this = $(this);
    var div = $('#move_form');
    div.load($this.prop('href'), function () {
        div.show();

        $('body').on('click', function () {
            div.hide();
        });
    });

    e.preventDefault();

    return false;
});

$('#delete_context').on('click', function (e) {
    if (confirm("Are you sure to delete this context?") === true) {
        aggressive_message();
        return true;
    } else {
        e.preventDefault();
        return false;
    }
});

$('#delete_topic').on('click', function (e) {
    if (confirm("Are you sure to delete this topic?") === true) {
        aggressive_message();
        return true;
    } else {
        e.preventDefault();
        return false;
    }
});

$('.focus').focus();

$('#date_line li').hover(function () {
    $(this).find('ul').stop(true, true).slideDown();
}, function () {
    $(this).find('ul').stop(true, true).slideUp();
});

$('#b_task').on('click', function () {
    aggressive_message();

    var status = $(this).data('status');
    var context = $(this).data('context');

    $.ajax({
        url: site_url + 'cc/topic/open_close/',
        type: 'GET',
        data: {'status': status, 'context': context},
        success: function (result) {
            if (result !== 'ok') {
                alert(result);
            }
            else {
                window.location = document.URL;
            }
        }
    });

});

function aggressive_message(message, load) {
    show_load = load === undefined ? 'div span' : '';

    if (message !== undefined && typeof message === 'string') {
        $('#aggressive_message ' + show_load).html(message);
    }
    $('#aggressive_message').css('display', 'table');
}

function hide_aggressive_message() {
    $('#aggressive_message').fadeOut().html('<div><span></span></div>');
}

var key_map_help = new Array();

// Shortkeys.
$(function () {
    // Search.
    shortcut = 'shift+7';
    key_map_help[shortcut] = 'Search focus';
    $(document).bind('keydown', shortcut, function () {
        $('#search').focus().select();
        return false;
    });

    // Login form.
    shortcut = 'alt+c';
    key_map_help[shortcut] = 'Login form';
    $(document).bind('keydown', shortcut, function () {
        document.location = site_url + 'cc/user/login_form';
        return false;
    });

    // Logout.
    shortcut = 'alt+x';
    key_map_help[shortcut] = 'Logout';
    $(document).bind('keydown', shortcut, function () {
        document.location = site_url + 'cc/user/logout';
        return false;
    });

    // Go to Home.
    shortcut = 'alt+7';
    key_map_help[shortcut] = 'Go to Home';
    $(document).bind('keydown', shortcut, function () {
        document.location = site_url;
        return false;
    });

    // Participants.
    shortcut = 'alt+p';
    key_map_help[shortcut] = 'Go to participants';
    $(document).bind('keydown', shortcut, function () {
        document.location = site_url + 'account/participant/all_people';
        return false;
    });

    // Disabled Shortkeys.
    $('div.nicEdit-main').bind('keydown', 'shift+7', function (e) {
        e.stopPropagation();
    });

    // Shortkeys map.
    shortkeys_map = function () {
        aggressive_message('<h2>Keyboard shortcuts</h2><ul id="shortcuts">' + $('#shortcuts').html() + '</ul>', 0);
        count = 0;
    };

    // Generate key help html.
    for (var key in key_map_help) {
        $('#shortcuts').append($('<li><b>' + key + ':</b> ' + key_map_help[key] + '</li>'));
    }
});

// Show shotcuts map.
document.onkeydown = keydown;
var count = 0;

function keydown(evt) {
    if (!evt)
        evt = event.altKey;

    if (evt.altKey && evt.target.nodeName !== "INPUT" && evt.target.classList[0] !== 'nicEdit-main') {
        if (count === 9) {
            shortkeys_map();
        }

        evt.preventDefault ? evt.preventDefault() : (evt.returnValue = false);

        count++;
    }

    if (evt.keyCode === 27) {
        hide_aggressive_message();
    }
}