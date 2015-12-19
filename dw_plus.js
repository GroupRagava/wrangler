var dwp ={}

dwp.eigenvectors = [];
dwp.processQueue = [];
dwp.numOfChunk = 0;
dwp.dataDic = {};
dwp.split = false;
dwp.chunkCounter = -1;

dwp.addEigenvector = function(eigenvector,chunkID,group,table) {
	if(dwp.eigenvectors.length == group) {
		var group0 = [chunkID];
		dwp.chunkGroup.push(group0);
		dwp.eigenvectors.push(eigenvector);
		if(group != 0) {
			//console.log(table)
			//console.log(JSON.parse(JSON.stringify(table)))
			dwp.processQueue.push(table);
		}
	}else {
		var num = dwp.chunkGroup[group].length;
		dwp.chunkGroup[group].push(chunkID);
		for(var i = 0; i< dwp.eigenvectors[group].length; i++) {
			dwp.eigenvectors[group][i] = (dwp.eigenvectors[group][i] * num + eigenvector[i]) / (num + 1);

		}

	}
	return;
	
}

var decopy = function(table){
	var result = [];
	for (var i = 0; i < table.length; i++) {
		var col = [];
		for (var j = 0; j < table[i].length; j++) {
			col.push(table[i][j]);
		}
		result.push(col);
	}
	return result;
}

dwp.eigenvectorThreshold = 0.3;
dwp.chunkGroup = [];
dwp.scriptGroup = [];
var processedCounter = 0;
dwp.groupEigenvector = function(options, eigenvector,chunkID,table, originalTable) {
	if(dwp.eigenvectors.length == 0) {
		dwp.addEigenvector(eigenvector,chunkID,0,table);
		return 0;
	}else {
		var length = dwp.eigenvectors.length;
		var minDiff = 1000;
		var group = length;
		for(var i = 0;i<length; i++) {
			if(dwp.eigenvectors[i].length != eigenvector.length) {
				continue;
			}
			var diff = 0;
			for(var j = 0; j < eigenvector.length; j++) {
				diff += Math.abs(eigenvector[j] - dwp.eigenvectors[i][j]);
			}
			if(diff < dwp.eigenvectorThreshold && diff < minDiff) {
				minDiff = diff;
				group = i;
			} 

		}
		
		if(group != length || dwp.split) {
			dwp.addEigenvector(eigenvector,chunkID,group,table);
		}else {
			dwp.findBoundary(options,table,chunkID,originalTable)
			//dwp.addEigenvector(eigenvector,chunkID,group,table);
		}

		return group;
	}
}

var container = jQuery('#table')
	var previewContainer = jQuery('#preview')

	var initial_transforms = [];
var startWrangler_plus_ = function(dt){
		eigenvector = dwp.wrangler_({
			tableContainer:container,
			table:dt,
			transformContainer:jQuery('#transformEditor'),
			previewContainer:previewContainer,
      dashboardContainer:jQuery("#wranglerDashboard"),
			initial_transforms:initial_transforms
		})
		return eigenvector
		//console.log(initial_transforms)

}
var startWrangler_plus = function(dt,chunkID){

		dwp.wrangler({
			tableContainer:container,
			table:dt,
			transformContainer:jQuery('#transformEditor'),
			previewContainer:previewContainer,
      dashboardContainer:jQuery("#wranglerDashboard"),
			initial_transforms:initial_transforms
		},chunkID)
		//console.log(initial_transforms)

	}

dwp.findBoundary = function(options,table,chunkId,originalTable) {
	console.log(dwp.dataDic)
	
	var targetingVector = dwp.eigenvectors[dwp.eigenvectors.length -1]
	//console.log(targetingVector)
	var lines = originalTable[0][0].split("\n")
	var length = lines.length;
	//console.log(length)
	var boundary = length
	var topVector = []
	var topTable = ""
	var delta = length
	/*while(delta > 0.5) {
		delta = (delta / 2) | 0
		if (dwp.isSame(topVector,targetingVector)) {
			boundary += delta;
		}
		else {
			boundary -= delta;
		}
		topTable = ""
		for(var i = 0; i<boundary;i++) {
			topTable = topTable.concat(lines[i])
    		topTable = topTable.concat("\n")
		}
		//console.log(topTable)

		initial_transforms = dw.raw_inference(topTable).transforms
		var dt = dv.table(topTable)
		topVector = startWrangler_plus_(dt)
	}*/
	while(!dwp.isSame(topVector,targetingVector) && boundary > 10) {
	 	boundary = boundary-1
	 	topTable = ""
	 	for(var i = 0; i<boundary;i++) {
	 		topTable = topTable.concat(lines[i])
	    		topTable = topTable.concat("\n")
	 	}
	 	//console.log(topTable)

	 	initial_transforms = dw.raw_inference(topTable).transforms
	 	var dt = dv.table(topTable)
	 	topVector = startWrangler_plus_(dt)
	 	//console.log(topVector)

	}
	dwp.split = true;
	initial_transforms = dw.raw_inference(topTable).transforms
	dwp.numOfChunk++
	var dt1 = dv.table(topTable)
	dwp.chunkCounter--
	startWrangler_plus(dt1)
	//dwp.split = true;
	var bottomTable = ""
	//console.log(boundary)
	for(var i = (boundary|0) +1; i<length;i++) {
		//console.log(i)
			bottomTable = bottomTable.concat(lines[i])
    		bottomTable = bottomTable.concat("\n")
		}
	initial_transforms = dw.raw_inference(bottomTable).transforms
	//console.log(bottomTable)
	var dt2 = dv.table(bottomTable)
	//console.log(startWrangler_plus_(dt))
	startWrangler_plus(dt2)
	//console.log(dt)
	dwp.split = false
			

		//console.log(initial_transforms)
		
		//dwp.wrangler(options,topTable) 

		

		//tryVector = dwp.get_column_stats_plus(table,length)
		//if(dwp.diff(targetingVector,tryVector))
	
}
dwp.isSame = function(v1,v2) {
	var threshold = 0.1
	if(v1.length!=v2.length) {
		return false
	}
	var diff = 0;
	for(var i = 0;i<v1.length;i++) {
		diff+= Math.abs(v1[i]-v2[i])
	}
	if(diff > threshold) {
		return false
	}
	return true;
}

var initial_transforms_plus

dwp.wrangler_ = function(options){
	//dwp.numOfChunk++;
	var tContainer = options.tableContainer, previewContainer = options.previewContainer, transformContainer = options.transformContainer, table = options.table, originalTable = table.slice(), temporaryTable, vtable, afterTable, transform,
		engine, suggestions, editor, wrangler = {}, script, w = dw.wrangle(), tableSelection, scriptContainer = jQuery(document.createElement('div')).attr('id','scriptContainer'), editorContainer = jQuery(document.createElement('div')).attr('id','editorContainer'), dashboardContainer = options.dashboardContainer;
	//console.log("table")
	//console.log(options.initial_transforms);
	//dwp.chunks[chunkID] = table;
	//console.log(dwp.chunks);
	initial_transforms_plus = options.initial_transforms
	if(options.initial_transforms){
		options.initial_transforms.forEach(function(t){
			w.add(t);
		})
		w.apply([table]);
	}
	copyTable = table.slice();
	if(options.initial_transforms){
		options.initial_transforms.forEach(function(t){
			w.add(t);
		})
		w.apply([copyTable]);
	}

	dwp.dataDic[dwp.chunkCounter] = copyTable
	
	//console.log("startPoint" + chunkID);
	//console.log(table);
	//dwp.dataDic[chunkID] = table;

	var eigenvector = []
	//console.log(table);
	table.forEach(function(c, i){
			var length = c.length;
			var test = dw.get_column_stats_plus(c,length);
			for(var i = 0; i < test.length;i++) {
				eigenvector.push(test[i]);
			}
		})
    return eigenvector



	

}


dwp.wrangler = function(options){
	dwp.chunkCounter++;
	var tContainer = options.tableContainer, previewContainer = options.previewContainer, transformContainer = options.transformContainer, table = options.table, originalTable = table.slice(), temporaryTable, vtable, afterTable, transform,
		engine, suggestions, editor, wrangler = {}, script, w = dw.wrangle(), tableSelection, scriptContainer = jQuery(document.createElement('div')).attr('id','scriptContainer'), editorContainer = jQuery(document.createElement('div')).attr('id','editorContainer'), dashboardContainer = options.dashboardContainer;
	initial_transforms_plus = options.initial_transforms
	if(options.initial_transforms){
		options.initial_transforms.forEach(function(t){
			w.add(t);
		})
		w.apply([table]);
	}
	dwp.dataDic[dwp.chunkCounter] = table;

	var eigenvector = []
	table.forEach(function(c, i){
			var length = c.length;
			var test = dw.get_column_stats_plus(c,length);
			for(var i = 0; i < test.length;i++) {
				eigenvector.push(test[i]);
			}
		})
    var groupCount = dwp.eigenvectors.length
	var group = dwp.groupEigenvector(options,eigenvector,dwp.chunkCounter,table,originalTable);
	var chunkState = document.getElementById("ChunkState")
	chunkState.innerHTML = "Chunk Processed : " + (dwp.chunkCounter+1) + "/" + dwp.numOfChunk;
	if(groupCount == group) {
		var DatasourceNum = document.getElementById("DatasourceNum")
		groupCount++
		DatasourceNum.innerHTML = "Datasource Detected : " + groupCount;
	}



	

}


dw.get_column_stats_plus = function(col, nRows) {
	var numMissing = 0;
	var numDates = 0;
	var numNumbers = 0;
	var numStrings = 0;

	var numCommas = 0;
	var numColons = 0;
	var numPipes = 0;
	var numTabs = 0;


	for (var r = 0; r < nRows; r++) {
		var elt = col[r];
		if (dw.is_missing(elt)) {
			numMissing++;
		}
		else if (dw.date_parse(elt)) {
			numDates++;
		}
		else if (!isNaN(Number(elt))) {
			numNumbers++;
		}
		if (elt) {
			var commas = elt.match(/,/g);
			var colons = elt.match(/\:/g);
			var pipes = elt.match(/\|/g);
			var tabs = elt.match(/\t/g);
			if (commas) numCommas += commas.length;
			if (colons) numColons += colons.length;
			if (pipes) numPipes += pipes.length;
			if (tabs) numTabs += tabs.length;
		}
	}
	numStrings = nRows - numMissing - numNumbers - numDates;

	var numRealElts = nRows - numMissing;


	var colHomogeneity = 0;

	var pctMissing = numMissing / nRows;
	var pctDates = numDates / nRows;
	var pctNumbers = numNumbers / nRows;
	var pctStrings = numStrings / nRows;


	

	colHomogeneity = pctDates*pctDates + pctNumbers*pctNumbers + pctStrings*pctStrings;

	return [pctMissing, pctDates,
			pctNumbers, pctStrings];
}



dwp.transform_menu = function(){
	
	var menu = {};
	
	var options = {}, interaction = options.interaction, transforms = [
		{name:'Title', sub:[{name:'DataWranglerPlus', context : 'DataWranglerPlus'}]},
		{name:'Chunk', sub:[{name:'PDatasourceNum',context : 'Datasource Processed : '+ processedCounter}]},	
		{name:'Chunk', sub:[{name:'DatasourceNum',context : 'Datasource Detected : ' + dwp.eigenvectors.length}]},
		{name:'Chunk', sub:[{name:'ChunkState',context : 'Chunk Processed : '+ (dwp.chunkCounter + 1) + '/' + dwp.numOfChunk}]}		
	

	];
	
	var vis = d3.select('#'+ "wranglerDashboard"), editor = dw.jq('div').addClass('detail_editor_container')


		
	menu.draw = function(){
		
		//console.log(transforms)
		var idx = d3.range(transforms.length)

		var sub = vis.append('div').attr('id', 'menu').selectAll('div.menu_group')
		  .data(idx)
		  .enter().append('div')
			.attr('class', 'menu_group')

	  sub.selectAll('div.menu_option')
		  .data(function(d, i){return d3.range(transforms[d].sub.length).map(function(){return d})})
		  .enter().append('div')
			.attr('class', function(d, i){return 'title '} )
			.attr('id', function(d, i){return transforms[d].sub[i].name})
		  	.text(function(d, i) { return transforms[d].sub[i].context})
		    
	

		
	}	

	menu.draw();

	return menu;
}
	var container = jQuery('#table')
	var previewContainer = jQuery('#preview')

	
var startWrangler_update = function(dt){

		dw.wrangler({
			tableContainer:container,
			table:dt,
			transformContainer:jQuery('#transformEditor'),
			previewContainer:previewContainer,
      dashboardContainer:jQuery("#wranglerDashboard"),
			initial_transforms:initial_transforms_plus,
			plus:true
		})

}
