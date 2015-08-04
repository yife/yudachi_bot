function initialize() {
}

function yudachinize(text) {
  return text.
    replace(/\s/g, "").
    replace(/\r/g, "").
    replace(/\n/g, "").
    replace(/く、/g, "いっぽくて、").
    replace(/となっていますが/g, "っぽいけど").
    replace(/ありますが/g, "あるっぽいけど").
    replace(/雨の見込みです。/g, "雨が降るっぽい。").
    replace(/雨の降る所がある/g, "雨が降るところもある").
    replace(/影響により/g, "せいで").
    replace(/(の)?見込みです。/g, "っぽい。").
    replace(/ている/g, "てる").
    replace(/となる/g, "になる").
    replace(/となり、/g, "になって、").
    replace(/を伴い/g, "もあって").
    replace(/を中心に/g, "のあたりで").
    replace(/覆われています/g, "覆われてるっぽい").
    replace(/覆われ/g, "覆われて").
    replace(/ため/g, "から").
    replace(/います。/g, "るっぽい。").
    replace(/ります。/g, "るっぽい。").
    replace(/ますが、/g, "るっぽいけど、").
    replace(/ですが、/g, "っぽいけど、").
    replace(/でしょう。/g, "っぽいかも。").
    replace(/ください。|下さい。/g, "ほしいっぽい。").
    replace(/概ね/g, "だいたい").
    replace(/また、/g, "あと、").
    replace(/されます/g, "されるっぽい").
    replace(/がり、/g, "がるっぽくて、").
    replace(/があり/g, "があって").
    replace(/また、/g, "それに、").
    replace(/などの/g, "とかの").
    replace(/非常に/g, "とっても").
    replace(/にあり、/g, "にあって、").
    replace(/。/g, "。\n");
}

function onReceiveWeather(res) {
    var weather = JSON.parse(res);
    var text = weather["description"]["text"];
    api.slack.talk("天気調べたっぽい。");
    api.slack.talk(yudachinize(text));
}

function getRandomArbitary(min, max) {
  return Math.random() * (max - min) + min;
}

function onTalk(name, text) {
  onMessage(name, text).
    when(/(yudachi|夕立|ゆうだち).*(天気|てんき).*(教えて|どうなってる|？|\?).*/).then(function(m) {
      var acode = getAreaCode(text);
      //取得できなかった場合はデフォルトの地域コードを設定する
      if ( acode == "" ){
      	acode = "130010";  
      }
      var url = "http://weather.livedoor.com/forecast/webservice/json/v1?city="+acode;
      var query = { city: acode };
      api.slack.talk("今調べるっぽい～。")
      api.http.get(url, query, 'onReceiveWeather');
    }).
    when(/(夕立|ゆうだち|yudachi|yudachi_bot)いる(|？|\?)/).then(function(m) {
      api.slack.talk(sample([
        "お呼びっぽい？何ですか？",
        "ふ～ん…何それ？新しい遊びっぽい～？",
        "提督さん、ご用事はなぁに？",
        "うぅ～んっ、気持ちいいっぽーい！"
      ]));
    }).
    when(/^(夕立|ゆうだち|yudachi)[:|：|、]?(.*)(しそう)[\?|？]*$/).then(function(m) { api.slack.talk(m[2] + "するっぽい〜？"); }).
    when(/^(夕立|ゆうだち|yudachi)[:|：|、]?(.*)(そう|かも|かな)[\?|？]*$/).then(function(m) { api.slack.talk(m[2] + "っぽい〜？"); }).
    when(/^(夕立|ゆうだち|yudachi).*ぽい[\?|？]*$/).then(function(m) { api.slack.talk("ぽいぽいぽいー"); }).
    when(/^poi$/).then(function(m) { api.slack.talk(sample(["pock you", "pock you", "pock you", "ぽっくゆ〜！"])); }).
    when(/^(夕立|ゆうだち|yudachi).*(ドー?ナッ?ツ|どー?なっ?つ)/).then(function(m) { api.slack.talk("素敵なドーナッツパーティしましょ！"); }).
    when(/^(夕立|ゆうだち|yudachi).*(うるさい|黙れ|だまれ)/).then(function(m) { api.slack.talk_with_icon("夕立、静かにしてたっぽい〜","yudachi_oko"); }).
    when(/^＞(.*)＜$/).then(function(m) { api.slack.talk(suddenDeath(yudachinize(m[1]))); })
}
