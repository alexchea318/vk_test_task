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
  //13 - энтер, 8 - бекспейс, 46 - delete, 32 - пробел
  var text=inputing.innerHTML;
  //console.log(text);
 /* if (key!=8 && key!=46)
  {*/
    text=text.replace(/(\w+@\w+\.\w+)/mg, '<a>$1</a>'); //alex@alex.ru
    text=text.replace(/(( |\&nbsp\;|^)@\w+)/mg, '<a>$1</a>'); //@alex_318
    text=text.replace(/(( |\&nbsp\;|^)#\S[^\&]+)/mg, '<a>$1</a>'); //#хэштег
    text=text.replace(/((http|https):\/\/\S+\.\S+)/mg, '<a>$1</a>'); //ссылка

    text=text.replace("<a><a>", "<a>");
    text=text.replace("</a>;</a>;", "</a>;");
  /*} else {*/
    text=text.replace(/<a>([^#@\/:]+)<\/a>/mg, '$1');
  //}
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
var listener = function (event) {
  var inputing = document.querySelector('#span_textarea');
  //inputing.innerHTML=inputing.innerHTML.replace(/\&nbsp\;/gi, '_');
  var len=inputing.textContent.length;

  if (len<1){
    var audio = document.querySelector('#audio');
    audio.style.animation=send_selector.animation_back;
    send_selector.active="audio";
  } else {
    var audio = document.querySelector('#audio');
    audio.style.animation=send_selector.animation_to;
    send_selector.active="send";
  
    if(event) {
      try{
        let key=event.keyCode;
        console.log(key);
        if (key == 13 || key == 8 || key == 46 || key == 32){
          lightning(inputing, key);
        }
      } catch {
        if (inputing.textContent[len-1]==" ") lightning(inputing, 0);
      }
    }
  }

  emoji_button_resizer();
}

//Удерживаниекнопки включения эмодзи на месте
function emoji_button_resizer(){
  var inputing = document.querySelector('#span_textarea');
  var button= document.querySelector("#emoji");
  if (get_width()<=breakpoint){
    if (inputing.clientHeight>40) button.style.transform="scale(1.25) translatey(-11px)";
    else button.style.transform="scale(1.25) translatey(-7px)";
  } else {
    button.style.transform="none";
  }
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

//Переключение на историю
function to_history(){
  document.querySelector('#emoji_list').style.display="none";
  document.querySelector('#save_emoji').style.display="block";
  document.querySelector('#history_emoji').className="active_tool";
  document.querySelector('#all_emoji').className="not_active_tool";
}

//Переключение на список
function to_list(){
  document.querySelector('#emoji_list').style.display="block";
  document.querySelector('#save_emoji').style.display="none";
  document.querySelector('#history_emoji').className="not_active_tool";
  document.querySelector('#all_emoji').className="active_tool";
}

//Ассинхронная установка состояния
function set_state(emojies, opener){
  if (!emojies.querySelector(':hover') && !opener.querySelector(':hover')){
    emojies.style.display='none';
  }
}

//Открытие и закрытие emoji
async function open_emoji(){
  if (get_width()<=breakpoint) return;

  var opener  = document.querySelector('#emoji');
  var emojies = document.querySelector('#emoji_select');
  
  opener.onmouseover = function() {
    to_list();
    emojies.style.display='block';
  }
  
  opener.onmouseout = function() {
    set_state(emojies, opener);
  }

  emojies.onmouseover = function() {
    emojies.style.display='block';
  } 

  emojies.onmouseout =  function() {
    set_state(emojies, opener);
  }
}

//Открытие и закрытие emoji на oneclick
function mobile_open_emoji(){
  if  (get_width()>breakpoint) return;
  var opener  = document.querySelector('#emoji');
  var emojies = document.querySelector('#emoji_select');

  if (emojies.style.display=='block'){
    emojies.style.display='none';
  } else {
    to_list();
    emojies.style.display='block';
  }
}

//Измение ширины textarea
function responsible(event){
  var width=get_width();
  if (width<=breakpoint){
    if (width>655)  width=width-90+"px"
    else width=width-90+"px";

    document.documentElement.style.setProperty('--form_width', width);
  } else{
    document.documentElement.style.setProperty('--form_width', "450px");
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
  form.addEventListener("keyup", listener, false);
  form.addEventListener("kedown", listener, false);

  //Доп проверка при перзагрузке
  responsible();
  emoji_button_resizer();
  await load_emoji();
};