function createAgentImpression(agent_id) {
    settings = get_settings(
	'agent_impression/'+ agent_id + '/', 'POST');
    settings['headers'] = {};
    settings['async'] = false;
  
    var jqXHR = $.ajax(settings);
    console.log(JSON.parse(jqXHR.responseText))
}
