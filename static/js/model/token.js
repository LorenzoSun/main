define('model/token',[ 'api/token', 'config/url'], function(apiToken, configUrl) {

    //服务器接口
    //var apiObj = apiToken.getToken;
    /**
     * 领域对象，传递给服务器的数据
     */
    var bizObj = {token:'', body:{deviceId:'H5TOUCH', osVersionNo: '1.0',appVersionNo:'1.0'}};

    /**
     *
     * @param callback 回调方法
     * @param isForce  1强制从服务器重新获取token，否则优先取cookie值
     */
    function getToken(callback, isForce) {
        var token = '';
        if(isForce != 1) {
            token = $.cookie.getH5('token');
            if(token && token.length>0) {
                callback && callback({errorCode:0, body:{token:token}});
                return;
            }
        }
        $.xsr($.makeUrl(apiToken.getToken, bizObj), function(res) {
            try {
                if (res.errorCode == 0) {
                    token = res.body.token;
                    setToken(token);
                }
                callback && callback(res);
            } catch (e) {

                throw e;
            }
        });

    }

    function setToken(token) {
        //写入cookie
        $.cookie.addH5('token', token, '/', 86400*365, configUrl.cookieDomain);
        return true;
    }

    function delToken() {
        $.cookie.delH5('token', '/', configUrl.cookieDomain);
        return true;
    }

    return {
        getToken: getToken,
        setToken: setToken,
        delToken:delToken,
        getBizObj : function() {
            return bizObj;
        }
    }
});