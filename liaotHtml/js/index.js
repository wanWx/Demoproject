$(function() {
    var _editArea = $('#editArea');

    //显示隐藏发送按钮
    var _editAreaInterval;

    var callback = {
        Push: function (result) {
            var html = '<div class="message">' +
            '<div class="nictime">' +
                '<span class="time">'+ result.timestamp + '</span>' +
                '</div>' +
                '<div class="nickname">' + result.channel + '</div>' +
                '<img class="avatar" src="images/wwx.jpg" />' +
                '<div class="content">' +
                    '<div class="bubble bubble_default left">' +
                        '<div class="bubble_cont">' +
                            '<div class="plain">' +
                                '<pre>'+ result.message +'</pre>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>';
            $('#messageList').append(html)
            console.log(result)
        },

        Receive: function () {

        },

        Send: function () {}
    }



    var socket = {
        wx: null,
        url: 'wss://dev.flm158.com/platform/',
        fixedchannel: 'flm',
        
        connect: function () {
            var support = "MozWebSocket" in window ? 'MozWebSocket' : ("WebSocket" in window ? 'WebSocket' : null);

            if (support == null) {

                this.log("Your browser cannot support WebSocket！");

                return;
            }
            this.ws = new window[support](this.url);

            this.ws.onopen = function (event) {
                socket.subscribe('flm');
            };
            this.ws.onmessage = function (event) {

                var message = JSON.parse(event.data);

                callback[message.command](message);
            };
        },
        
        subscribe: function (channel) {
            if (!channel) {
                return
            }
            if (this.ws) {
                var parameter = JSON.stringify({

                    command: 'Receive',
                    action: 'Add',
                    channel: channel
                });
                this.ws.send(parameter);   
            }
        }, 

        push: function (message) {
            if (!message) {
                return
            }

            if (this.ws) {
                var parameter = JSON.stringify({

                    command: 'Send',
                    action: null,
                    channel: 'flm',
                    message: message
                });

                this.ws.send(parameter); 
            }
        }
        
    }

    $('#editArea').focus(function() {
        var _this = $(this),
            html;
        _editAreaInterval = setInterval(function() {
            html = _this.html();
            if (html.length > 0) {
                $('#web_wechat_pic').hide();
                $('#btn_send').show();
            } else {
                $('#web_wechat_pic').show();
                $('#btn_send').hide();
            }
        }, 200);
    });

    $('#editArea').blur(function() {
        clearInterval(_editAreaInterval);
    });

    //显示隐藏表情栏
    $('.web_wechat_face').click(function() {
        $('.box_ft_bd').toggleClass('hide');
        resetMessageArea();
    });

    //切换表情主题
    $('.exp_hd_item').click(function() {
        var _this = $(this),
            i = _this.data('i');
        $('.exp_hd_item,.exp_cont').removeClass('active');
        _this.addClass('active');
        $('.exp_cont').eq(i).addClass('active');
        resetMessageArea();
    });

    //选中表情
    $('.exp_cont a').click(function() {
        var _this = $(this);
        var html = '<img class="' + _this[0].className + '" title="' + _this.html() + '" src="images/spacer.gif">';
        _editArea.html(_editArea.html() + html);
        $('#web_wechat_pic').hide();
        $('#btn_send').show();
    });

    //播放音频
    $('.voice').click(function() {
        console.log($(this));
        var oAudio = $(this).find('audio');
        var oEm = $(this).find('em');
       var oSpan = $(this).find('i');
        oSpan.hide();
        var sja = $('audio');
        var sem = $('em');
        console.log(sja);
        for (var i = 0; i < sja.length; i++) {
            sja[i].pause();
        };
        if (oEm.hasClass('voice_ico_play')) {
            oAudio.get(0).pause();
            oEm.removeClass('voice_ico_play');

        } else {
            oEm.addClass('voice_ico_play');
            oAudio.get(0).play();
            sem.removeClass('voice_ico_play');
            oEm.addClass('voice_ico_play');
        }
    });

    //播放视屏
    $('.video_picture').click(function() {
        $(this).find('video').removeClass('video_none');
        $(this).find('video').addClass('video_block');
    });
    $('.video_box').click(function () {
        $(this).removeClass('video_block');
        $(this).addClass('video_none');
        console.log(1);
        return false;
        
    })
   /* var ovid = document.getElementById('vid');
    ovid.onclick = function () {
        console.log(this);
        this.= 'none';
    }*/

    // 发送消息
    $('#btn_send').click(function() {
        socket.push(_editArea.html())
    })


    resetMessageArea();


    function sendMsg(str) {}

    function resetMessageArea() {
        $('#messageList').animate({ 'scrollTop': 999 }, 500);
    }
    socket.connect();
});
