//Upload files
function xupload(selector, options){
	const $input = $(selector);
	const $trigger = $(options.trigger);
	options.cb = options.cb || function(){}
	
	if(options.multi){
		$input.attr("multiple", true);
	}
	
	if(options.accept && Array.isArray(options.accept)){
		$input.attr("accept", options.accept.join(","));
	}
	
	const changeHandler = event => {
		if(!event.target.files.length) return;
		
		const files = Array.from(event.target.files);
				
		files.forEach(file => {
			if(!file.type.match("image")) return;
			
			const reader = new FileReader();
			
			reader.onload = ev => {
				options.cb({name: file.name, result: ev.target.result});
			}
			
			reader.readAsDataURL(file);
		});
	}
	
	$trigger.on("click", () => {
		$input.trigger("click");
	});
	
	$input.on("change", changeHandler);		
}
