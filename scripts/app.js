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
  if (key!=8 && key!=46)
  {
    text=text.replace(/(\w+@\w+\.\w+)/mg, '<a>$1</a>'); //alex@alex.ru
    text=text.replace(/(( |\&nbsp\;|^)@\w+)/mg, '<a>$1</a>'); //@alex_318
    text=text.replace(/(( |\&nbsp\;|^)#\S[^\&]+)/mg, '<a>$1</a>'); //#хэштег
    text=text.replace(/((http|https):\/\/\S+\.\S+)/mg, '<a>$1</a>'); //ссылка

    text=text.replace("<a><a>", "<a>");
    text=text.replace("</a>;</a>;", "</a>;");
  } else {
    text=text.replace(/<a>([^#@\/:]+)<\/a>/mg, '$1');
  }
  console.log(text);
  inputing.innerHTML=text;

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
  }
  
  if(event) {
    let key=event.keyCode;
    if (key == 13 || key == 8 || key == 46 || key == 32){
      lightning(inputing, key);
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
  var temp = document.querySelector('#mes_template');
  var new_mes = temp.content.querySelector(".message");
  var new_mes_content = document.importNode(new_mes, true);
  new_mes_content.querySelector("#time").textContent = message.time;

  message.text=message.text.replace(/\&nbsp\;/gi, "");
  new_mes_content.querySelector("p").innerHTML = message.text;
  document.querySelector('#all_messages').appendChild(new_mes_content);

  var texts = document.querySelector("#span_textarea").textContent;
  console.log(texts.length);
  if (texts.length===2){
    if ( /\p{Extended_Pictographic}/u.test(texts) ){
      new_mes_content.querySelector("p").classList.add("perfect_emoji");
    }
  }
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
  if (send_selector.active=="audio"){
    return;
  } else {
    var inputing = document.querySelector('#span_textarea').innerHTML;
    add_message({time: get_time(), text:inputing});
    document.querySelector('#span_textarea').innerHTML="";
  }
}

//Печать эмодзи и сохранение в историю
function add_emoji(i,j){
  if (document.querySelector('#save_emoji').style.display=="block"){
    return;
  }

  var cur_emoji=emoji[i].items[j];
  document.querySelector('#span_textarea').textContent+=cur_emoji;
  listener();

  var save_group=document.querySelector('#save_emoji_group');
  var save_emojies=save_group.querySelectorAll('a');

  save_emojies.forEach(function(item){
    if (item.textContent===cur_emoji) item.remove();
  })

  if (save_emojies.length==25) save_emojies[24].remove();

  var emoji_box=document.querySelector('#save_one_emoji').content.cloneNode(true);
  var link=emoji_box.querySelector("a");
  link.textContent=cur_emoji;
  var attr="add_emoji("+i+","+j+");";
  link.setAttribute("onclick", attr);

  save_group.insertAdjacentElement("afterBegin",link);
}

//Загрузка эмозди
async function load_emoji(){
  emoji.forEach(function(item, i){
    var temp = document.querySelector('#sticker_template');
    var theme = temp.content.cloneNode(true);
    theme.querySelector("span").textContent=item.title;
    document.querySelector('#emoji_list').appendChild(theme);
    
    item.items.forEach(function(one_emoji, j){
      var emoji_box=document.querySelector('#one_emoji').content.cloneNode(true);
      var link=emoji_box.querySelector("a");
      link.textContent=one_emoji;
      var attr="add_emoji("+i+","+j+");";
      link.setAttribute("onclick", attr);
      document.querySelectorAll('#emoji_group')[i].appendChild(link);
    });
  });
};

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
  window.addEventListener("resize", responsible, false);
  window.addEventListener("keyup", listener, false);
  window.addEventListener("kedown", listener, false);

  //Доп проверка при перзагрузке
  responsible();
  emoji_button_resizer();
  await load_emoji();
};