//Переключение режима аудио и отправки
const send_selector= {
  active: "audio",
  animation_to: "send_change 0.2s ease-in-out forwards",
  animation_back: "send_change 0.2s ease-in-out reverse"
};

//Констатнты для ширины окна
const breakpoint=960;
function get_width(){return document.documentElement.clientWidth}

//Подсветка с помощью регулярных выражений
function lightning(key){
  var inputting = document.querySelector('#span_textarea');
  if (/<img src/mg.test(inputting.innerHTML)) {
    //console.log("picture"); 
    return;
  }

  var inputting = document.querySelector('#span_textarea');
  var text=inputting.textContent;
 
  text=text.replace(/(@\w+)/mg, '<a>$1</a>'); //@alex_318 - упоминаия
  text=text.replace(/(\w+)<a>(@\w+)<\/a>(\.\w+)/mg, '<a>$1$2$3</a>'); //alex@alex.ru - почты
  text=text.replace(/(#\S+)/mg, '<a>$1</a>'); //#хэштег
  text=text.replace(/((http|https):\/\/\S+\.\S+)/mg, '<a>$1</a>'); //ссылка

  //Errors correct
  //text=text.replace(/<a>([^#@\/:]+)<\/a>/mg, '$1');

  if (key=='Enter') return;
  console.log(text);
  inputting.innerHTML=text;

  cursor_focus(inputting);
}

//Фокусировка на поле ввода
function cursor_focus(inputting){
  var range = document.createRange();
  range.selectNodeContents(inputting);
  range.collapse(false);
  var sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
}

//Включение или отключение опции отправки
var listener = function (key) {
  var inputting = document.querySelector('#span_textarea');
  var len=inputting.innerHTML.length;

  if (len<1){
    var audio = document.querySelector('#audio');
    audio.style.animation=send_selector.animation_back;
    send_selector.active="audio";
  } else {
    var audio = document.querySelector('#audio');
    audio.style.animation=send_selector.animation_to;
    send_selector.active="send";
  }

  if  (key != 'ArrowLeft' && key != 'ArrowRight' && key != 'emoji') {
    lightning(key);
  }

  emoji_button_resizer();
}

//Добавление сообщения в чат
function add_message(message){
  var inputting = document.querySelector("#span_textarea");

  var temp = document.querySelector('#mes_template');
  var new_mes = temp.content.querySelector(".message");
  var new_mes_content = document.importNode(new_mes, true);
  new_mes_content.querySelector("#time").textContent = message.time;

  message.text=message.text.replace(/\&nbsp\;/gi, "");
  new_mes_content.querySelector("p").innerHTML = message.text;

  document.querySelector('#all_messages').appendChild(new_mes_content);

  //Увеличение только 1 эмодзи
  var texts = inputting.textContent;
  if (texts.length===2){
    if ( /\p{Extended_Pictographic}/u.test(texts) ){
      new_mes_content.querySelector("p").classList.add("perfect_emoji");
    }
  }

  //Прокрутка вниз
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
  var inputting = document.querySelector('#span_textarea');
  if (send_selector.active=="audio"){
    return;
  } else {
    lightning(inputting);
    var texts = inputting.innerHTML;
    add_message({time: get_time(), text: texts});
    document.querySelector('#span_textarea').innerHTML="";
  }

  listener();

  //Закрываем эмодзи на мобильных после отправкки сообщения
  if (document.querySelector('#emoji_select').style.display=='block'){
    if (get_width()<=breakpoint) mobile_open_emoji();
  }

  cursor_focus(inputting);
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

  emoji_button_resizer();
}

//Entry point
window.onload = async function() {
  var str="Привет! Это тестовое задание для ВКонтакте. Сообщения можно отправлять."
  add_message({time: get_time(), text: str});
  open_emoji();

  var form=document.querySelector('#span_textarea');
  if (get_width()>breakpoint) cursor_focus(form);

  window.addEventListener("resize", responsible, false);

  //Доп проверка при перзагрузке
  responsible();
  emoji_button_resizer();

  await load_emoji();
};