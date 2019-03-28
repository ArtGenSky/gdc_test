
var todoJSON = '{' +
  '"Jan": [' +
    '{' +
      '"date": "01/02/2014",' +
      '"time": "8:00pm",' +
      '"title": "Lunch with John"' +
    '},' +
    '{' +
      '"date": "01/12/2014",' +
      '"time": "12:00pm",' +
      '"title": "Call Nick"' +
    '},' +
    '{' +
      '"date": "01/18/2014",' +
      '"time": "4:00pm",' +
      '"title": "Project Meeting"' +
    '}' +
  '],' +
  '"Feb": [' +
    '{' +
      '"date": "02/08/2014",' +
      '"time": "4:00pm",' +
      '"title": "Team Meeting"' +
    '},' +
    '{' +
      '"date": "02/16/2014",' +
      '"time": "12:00pm",' +
      '"title": "Lunch with Joe"' +
    '},' +
    '{' +
      '"date": "02/19/2014",' +
      '"time": "5:00pm",' +
      '"title": "Project Meeting"' +
    '}' +
  '],' +
  '"Mar": [' +
    '{' +
      '"date": "03/19/2014",' +
      '"time": "4:00pm",' +
      '"title": "English Class"' +
    '},' +
    '{' +
      '"date": "03/15/2014",' +
      '"time": "12:00pm",' +
      '"title": "Lunch with Bill"' +
    '},' +
    '{' +
      '"date": "03/28/2014",' +
      '"time": "5:00pm",' +
      '"title": "Project Meeting"' +
    '}' +
  ']' +
'}';

var todo = JSON.parse(todoJSON);

//method to get missing month
todo.getMonthData = function(month, callback) {
  var self = this;
  var someUrl = 'http://example.com/';
  $.get( someUrl+'?month='+month, function( data ) {
    self[month] = data;
    $('.todo-list__loader').hide();
    callback();
  }, "json" );
}

$('.months-nav__month').click(function() {
  var $this = $(this);
  var month = $this.data('month');
  var isMonthTodoRendered = !!$('.todo-list__item[data-month="'+month+'"]').length;
  
  $('.months-nav__month .btn').removeClass('btn_active');
  $this.find('.btn').addClass('btn_active');

  $('.todo-list__item[data-month]').hide();
  $('.todo-list__item[data-month='+month+']').show();

  $('.todo-list__loader').hide();

  if (!todo[month]) {
    $('.todo-list__loader').show();
    todo.getMonthData(month, function() {
      renderMonthTodo(month);
    });

    return;
  }

  if (!isMonthTodoRendered) {
    renderMonthTodo(month);
  }
});

function renderMonthTodo(month) {
  todo[month].forEach(function(todoItem) {
    var todoItemLayout = 
    '<div class="todo-list__item" data-month="'+month+'">' +
      '<div class="todo-item">' +
        '<div class="todo-item__date">' + 
          todoItem.date +
        '</div>' +
        '<div class="todo-item__time">' + 
          todoItem.time +
        '</div>' +
        '<div class="todo-item__title">' + 
          todoItem.title +
        '</div>' +
      '</div>' +
    '</div>';

    $('.todo-list').append( $(todoItemLayout) );
  });
}

$(document).ready(function() {
  $('.months-nav__month[data-month="Jan"]').trigger('click');
});