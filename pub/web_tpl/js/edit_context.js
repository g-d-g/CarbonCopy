var options = {
	dataType: 'json',
	type: 'post',
	success: process_validation,
	beforeSubmit: function() {
		aggressive_message();
		$('#id').val($('#id').val().replace(/(\-)$/g, ''));
	}
};
$('#edit_context_form').ajaxForm(options);

function process_validation(data) {
	if (data.result === 'ok') {
		if ($('#context').val().length === 0) {
			window.location = site_url + 'cc/context/resume/' + data.message;
		} else {
			window.location = site_url + 'cc/context/resume/' + $('#context').val();
		}
	} else {
		hide_aggressive_message();
		alert(data.message);
	}
}

$('textarea#context_description').ckeditor();