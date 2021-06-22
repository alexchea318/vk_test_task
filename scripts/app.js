//Переключение режима аудио и отправки
var send_selector= {
  active: "audio",
  animation_to: "send_change 0.2s ease-in-out forwards",
  animation_back: "send_change 0.2s ease-in-out reverse"
};

const breakpoint=960;
function get_width(){return document.documentElement.clientWidth}

//Подсветка с помощью регулярных выражений
function lightning(inputing, key){
  var text=inputing.innerHTML;
  alert(key);
  console.log(key);
  //( |\&nbsp\;|^)
  if (key != 'Backspace' && key != 'delete') {
    text=text.replace(/(\w+@\w+\.\w+)/mg, '<a>$1</a>&nbsp;'); //alex@alex.ru
    text=text.replace(/(@\w+)/mg, '<a>$1</a>&nbsp;'); //@alex_318
    text=text.replace(/(#\S[^\&<]+)/mg, '<a>$1</a>&nbsp;'); //#хэштег
    text=text.replace(/((http|https):\/\/\S+\.\S+[^\&<])/mg, '<a>$1</a>&nbsp;'); //ссылка
  }

  text=text.replace("&nbsp;&nbsp;", "&nbsp;");
  text=text.replace("<a><a>", "<a>");
  text=text.replace("</a>&nbsp;</a>&nbsp;", "</a>&nbsp;");
  text=text.replace(/<a>([^#@\/:]+)<\/a>/mg, '$1');

  console.log(text);
  inputing.innerHTML=text;

  cursor_focus(inputing);
}

//Фокусировка на поле ввода
function cursor_focus(inputing){
  var range = document.createRange();
  range.selectNodeContents(inputing);
  range.collapse(false);
  var sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
}

//Включение или отключение опции отправки
var listener = function (key) {
  var inputing = document.querySelector('#span_textarea');
  //inputing.innerHTML=inputing.innerHTML.replace(/\&nbsp\;/gi, '_');
  var len=inputing.innerHTML.length;

  if (len<1){
    var audio = document.querySelector('#audio');
    audio.style.animation=send_selector.animation_back;
    send_selector.active="audio";
  } else {
    var audio = document.querySelector('#audio');
    audio.style.animation=send_selector.animation_to;
    send_selector.active="send";
  
    if(key) {
      if (key == ' ' || key == 'Enter' || key=="Tab"
      || key == 'Backspace' || key == 'Delete'){
        lightning(inputing, key);
      }
    }
  }

  emoji_button_resizer();
}

//Добавление сообщения в чат
function add_message(message){
  var inputing = document.querySelector("#span_textarea");

  var temp = document.querySelector('#mes_template');
  var new_mes = temp.content.querySelector(".message");
  var new_mes_content = document.importNode(new_mes, true);
  new_mes_content.querySelector("#time").textContent = message.time;

  message.text=message.text.replace(/\&nbsp\;/gi, "");
  new_mes_content.querySelector("p").innerHTML = message.text;

  document.querySelector('#all_messages').appendChild(new_mes_content);

  var texts = inputing.textContent;
  if (texts.length===2){
    if ( /\p{Extended_Pictographic}/u.test(texts) ){
      new_mes_content.querySelector("p").classList.add("perfect_emoji");
    }
  }

  var chat = document.querySelector('#chat');
  chat.scrollTop = chat.scrollHeight;
}

//Часы и минуты для сообщений
function get_time(){
  var now = new Date(),
      hour = now.getHours(),
      minute = now.getMinutes();

  if ((""+minute).length==1) minute="0"+minute;
  if ((""+hour).toString.length==1) hour="0"+hour;

  return hour+':'+minute;  
}

//Функция отправки сообщения
function send_message(){
  var inputing = document.querySelector('#span_textarea');
  if (send_selector.active=="audio"){
    return;
  } else {
    lightning(inputing);
    var texts = inputing.innerHTML;
    add_message({time: get_time(), text: texts});
    document.querySelector('#span_textarea').innerHTML="";
  }
  listener();
  cursor_focus(inputing);
}

//Измение ширины textarea
function responsible(event){
  var width=get_width();
  if (width<=breakpoint){
    document.documentElement.style.setProperty('--form_width', width-90+"px");
    var avatar=document.querySelector("#mes_avatar");
    document.querySelector("#back").insertAdjacentElement("afterEnd",avatar);
  } else{
    document.documentElement.style.setProperty('--form_width', "450px");
    var n_avatar=document.querySelector("#mes_avatar");
    document.querySelector("#mes_menu").insertAdjacentElement("afterEnd",n_avatar);
  }

  var mes_bar=document.querySelector("#mes_header");
  if (width<311) mes_bar.style.display='none';
  else if (width<=breakpoint) {
    mes_bar.className="flex_mes_head";
    mes_bar.style.display='flex';
  }  else  {
    mes_bar.style.display='grid';
    mes_bar.className="";
  }
  emoji_button_resizer();
}

//Entry point
window.onload = async function() {
  var str="Привет! Это тестовое задание для ВКонтакте. Сообщения можно отправлять."
  add_message({time: get_time(), text: str});
  open_emoji();

  //Обработчики событий
  var form=document.querySelector('#span_textarea');
  if (get_width()>breakpoint) cursor_focus(form);

  window.addEventListener("resize", responsible, false);
  //form.addEventListener("keyup", listener, false);
  //form.addEventListener("kedown", listener, false);
  form.oninput = listener;

  //Доп проверка при перзагрузке
  responsible();
  emoji_button_resizer();
  await load_emoji();
};