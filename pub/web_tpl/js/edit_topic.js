$('#due').datepicker({
	'dateFormat': 'yy-mm-dd'
});

var options = {
	dataType: 'json',
	type: 'post',
	beforeSubmit: aggressive_message,
	success: process_validation
};
$('#add_topic_form').ajaxForm(options);

/**
 * 
 * @param json data response
 */
function process_validation(data) {
	if (data.result === 'ok') {
			var regex = new RegExp("\_+" + $('#id').val() + '$');
			window.location = site_url + 'cc/topic/resume/' + $('#context').val().replace(regex, '') + '_' + $('#id').val();
	} else {
		hide_aggressive_message();
		alert(data.message);
	}
}

$('textarea#topic_description').ckeditor();