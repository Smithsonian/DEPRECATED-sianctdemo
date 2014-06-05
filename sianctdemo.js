// Demo of Sidora Analysis API for CameraTrap
// file: sianctdemo.js
// author: Gert Schmeltz Pedersen - gertsp45@gmail.com
/***************************************************************************************************/
		
function sianctdemoOnload() {
    sianctdemoStatusLine('Welcome!');
	workflowName = ''; 
	speciesName = ' '; 
	obstablePids = '';
	markersArray = [];
	sianctdemoGetWorkflows();
	sianctdemoGetAllSpeciesNames();
	sianctdemoDrawMap();
	sianctdemoGetProjectStructure();
	sianctdemoGetObstables();
	sianctEmailAddress = '<a href="mailTo:SIDORA-DEV@SI-LISTSERV.SI.EDU?Subject=sianctdemo%20SYSTEM%20ERROR%20snapshot">SIDORA-DEV@SI-LISTSERV.SI.EDU<a/>';
}

function sianctdemoStatusLine(message) {
    $('#sianctdemoStatusArea').html(sianctdemoGetDateTime()+' '+message+sianctdemoGetPreviousStatus());
}

function sianctdemoGetDateTime() {
	return (new Date()).toLocaleString();
}

function sianctdemoGetPreviousStatus() {
	return '<br/>'+$('#sianctdemoStatusArea').html();
}

function sianctdemoGetWorkflows() {
    sianctdemoStatusLine('Getting workflow list ...');
	var url = '/sianctdemo/sianctdemoGetFile/sianctdemoWorkflows.html';
	$('#sianctdemoWorkflowSelectDiv').load(
			encodeURI(url)+' #sianctdemoWorkflowList',
			function(response, status, xhr) {
				if (status == 'error') {
				    sianctdemoStatusLine('SYSTEM ERROR: '+xhr.status+' '+xhr.statusText);
				    sianctdemoStatusLine('Send a snapshot of this window to the system manager at '+sianctEmailAddress);
				} else {
				    sianctdemoStatusLine('Got workflow list');
				}
			}
	);
}

function sianctdemoGetAllSpeciesNames() {
    sianctdemoStatusLine('Getting all species names ...');
	var url = '/sianctdemo/sianctdemoGetFile/sianctdemoAllSpeciesNames.html';
	$('#sianctdemoAjaxArea').load(
			encodeURI(url)+' #sianctGetSpeciesResult',
			function(response, status, xhr) {
				if (status == 'error') {
				    sianctdemoStatusLine('SYSTEM ERROR: '+xhr.status+' '+xhr.statusText);
				    sianctdemoStatusLine('Send a snapshot of this window to the system manager at '+sianctEmailAddress);
				} else {
				    $('#sianctdemoAllSpeciesSelect').html($('#sianctGetSpeciesResult')[0].innerHTML);
				    $('#sianctdemoSpecies').html($('#sianctGetSpeciesResult')[0].innerHTML);
				    sianctdemoStatusLine('Got all species names');
				}
			}
	);
}

function sianctdemoGetProjectStructure() {
    sianctdemoStatusLine('Getting project structure ...');
	var url = '/sianctdemo/sianctdemoGetFile/sianctdemoProjectStructure.html';
	$('#sianctdemoProjectStructureArea').load(
			encodeURI(url)+' #sianctGetProjectStructureResult',
			function(response, status, xhr) {
				if (status == 'error') {
				    sianctdemoStatusLine('SYSTEM ERROR: '+xhr.status+' '+xhr.statusText);
				    sianctdemoStatusLine('Send a snapshot of this window to the system manager at '+sianctEmailAddress);
					document.getElementById('sianctdemoMapArea').style.display='none';
				} else {
					var $count = $('#sianctGetProjectStructureCount').text();
					if ($count == '') $count = '0';
				    sianctdemoStatusLine('Found '+$count+' observation tables in the project structure');
					if ($count == '0') {
					    sianctdemoStatusLine('No observation tables indicates a SYSTEM ERROR, maybe configuration setting error(s), send a snapshot of this window to the system manager at '+sianctEmailAddress);
						document.getElementById('sianctdemoMapArea').style.display='none';
					} else {
					    $('#sianctdemoObstablesCount').html($count);
						document.getElementById('sianctdemoSelectionsArea').style.display='';
					}
				}
			}
	);
}

// ALTERNATIVE:
//function sianctdemoGetProjectStructure() {
//    sianctdemoStatusLine('Getting project structure ...');
//	var url = '/sianctdemo/sianctdemoGetProjectStructure';
//	$('#sianctdemoProjectStructureArea').load(
//			encodeURI(url)+' #sianctGetProjectStructureResult',
//			function(response, status, xhr) {
//				if (status == 'error') {
//				    sianctdemoStatusLine('SYSTEM ERROR: '+xhr.status+' '+xhr.statusText);
//				    sianctdemoStatusLine('Send a snapshot of this window to the system manager at '+sianctEmailAddress);
//					document.getElementById('sianctdemoMapArea').style.display='none';
//				} else {
//					var $count = $('#sianctGetProjectStructureCount').text();
//					if ($count == '') $count = '0';
//				    sianctdemoStatusLine('Found '+$count+' observation tables in the project structure');
//					if ($count == '0') {
//					    sianctdemoStatusLine('No observation tables indicates a SYSTEM ERROR, maybe configuration setting error(s), send a snapshot of this window to the system manager at '+sianctEmailAddress);
//						document.getElementById('sianctdemoMapArea').style.display='none';
//					} else {
//					    $('#sianctdemoObstablesCount').html($count);
//						document.getElementById('sianctdemoSelectionsArea').style.display='';
//					}
//				}
//			}
//	);
//}

function sianctdemoGetSpecies() {
	sianctdemoGetObstables();
    sianctdemoStatusLine('Getting species names from the selected observation tables ...');
    sianctdemoStatusLine('pids='+obstablePids);
    $('#sianctdemoSpecies').html('<option value=" ">getting names ...</option>');
	document.getElementById("sianctdemoStatusDiv").style.display = "";
	var url = '/sianctdemo/sianctdemoGetSpecies';
	$('#sianctdemoAjaxArea').load(
			encodeURI(url)+' #sianctGetSpeciesResult',
			{pids: obstablePids},
			function(response, status, xhr) {
				if (status == 'error') {
				    sianctdemoStatusLine('SYSTEM ERROR: '+xhr.status+' '+xhr.statusText);
				    sianctdemoStatusLine('Send a snapshot of this window to the system manager at '+sianctEmailAddress);
				} else {
				    $('#sianctdemoSpecies').html($('#sianctGetSpeciesResult')[0].innerHTML);
					if ($('#sianctdemoSpecies').html().indexOf('>0 names') > -1 ) {
					    sianctdemoStatusLine('No species names indicates a SYSTEM ERROR, maybe configuration setting error(s), send a snapshot of this window to the system manager at '+sianctEmailAddress);
					} else {
					    sianctdemoStatusLine('Got species names');
					}
				}
			}
	);
}

function sianctdemoSelectObstables() {
	var q = '';
	var speciesFilterCheckboxChecked = (document.getElementById("sianctdemoAllSpeciesFilterCheckbox")).checked;
	if (speciesFilterCheckboxChecked) {
		var i = document.getElementById("sianctdemoAllSpeciesSelect").selectedIndex;
		if (i>0) {
			var species = document.getElementById("sianctdemoAllSpeciesSelect").options[i].value;
			q = 'speciesTaxonrv:"' + species + '"';
		}
	}
	var idtypeFilterCheckboxChecked = (document.getElementById("sianctdemoIdtypeFilterCheckbox")).checked;
	if (idtypeFilterCheckboxChecked) {
		var researcherCheckboxChecked = (document.getElementById("sianctdemoResearcherCheckbox")).checked;
		var volunteerCheckboxChecked = (document.getElementById("sianctdemoVolunteerCheckbox")).checked;
		var q1 = '';
		var q2 = '';
		if (researcherCheckboxChecked) {
			q1 = document.getElementById("sianctdemoResearcherCheckbox").value;
		}
		if (volunteerCheckboxChecked) {
			q2 = document.getElementById("sianctdemoVolunteerCheckbox").value;
		}
		if (q1 && q2) {
			q1 = q1 + ' OR ' + q2;
		} else {
			if (q2) {
				q1 = q2;
			}
		}
		if (q && q1) {
			q = q + ' AND ';
		}
		if (q1) {
			q = q + 'datasetLabel:(' + q1 + ')';
		}
	}
	var datesFilterCheckboxChecked = (document.getElementById("sianctdemoDatesFilterCheckbox")).checked;
	if (datesFilterCheckboxChecked) {
		var beginDateFrom = document.getElementById("sianctdemoBeginFrom").value.replace(/\//g, '');
		var beginDateTo = document.getElementById("sianctdemoBeginTo").value.replace(/\//g, '');
		var endDateFrom = document.getElementById("sianctdemoEndFrom").value.replace(/\//g, '');
		var endDateTo = document.getElementById("sianctdemoEndTo").value.replace(/\//g, '');
		var q3 = 'cameraDeploymentBeginDate:[' + beginDateFrom + ' TO ' + beginDateTo + '] AND cameraDeploymentEndDate:[' + endDateFrom + ' TO ' + endDateTo + ']';
		if (q && q3) {
			q = q + ' AND ';
		}
		q = q + q3;
	}
	var geoFilterCheckboxChecked = (document.getElementById("sianctdemoGeoFilterCheckbox")).checked;
	if (geoFilterCheckboxChecked) {
		var north = document.getElementById("sianctdemoNorth").value.substring(0,8);
		var east = document.getElementById("sianctdemoEast").value.substring(0,8);
		var south = document.getElementById("sianctdemoSouth").value.substring(0,8);
		var west = document.getElementById("sianctdemoWest").value.substring(0,8);
		var q4 = 'cameraLongitude:[' + west + ' TO ' + east + '] AND cameraLatitude:[' + south + ' TO ' + north + ']';
		if (q && q4) {
			q = q + ' AND ';
		}
		q = q + q4;
	}
	if (!q) {
		var r= confirm('You did not select any filter, do you want to select all observation tables?');
		if (!r) return;
		if (r) q = 'PID:si*';
	}
    sianctdemoStatusLine('Selecting observation tables ... query=<BR/>'+q);
	var url = '/sianctdemo/sianctdemoSelectObstables/'+q;
	$('#sianctdemoAjaxArea').load(
			encodeURI(url)+' #sianctSelectObstablesResult',
			function(response, status, xhr) {
				if (status == 'error') {
				    sianctdemoStatusLine('SYSTEM ERROR: '+xhr.status+' '+xhr.statusText);
				    sianctdemoStatusLine('Send a snapshot of this window to the system manager at '+sianctEmailAddress);
				} else {
					var $count = $('#sianctSelectObstablesCount').text();
					if ($count == '') $count = '0';
				    sianctdemoStatusLine(' Found '+$count+' observation tables within the filters.');
				    sianctdemoShowSelection();
				}
			}
	);
}

function sianctdemoDrawMap() {
	var mapOptions = {
		center: new google.maps.LatLng(0, 0),
		zoom: 1,
		scaleControl: true,
		mapTypeId: google.maps.MapTypeId.HYBRID
	};
	sianctdemoMap = new google.maps.Map(document.getElementById("sianctdemoMapArea"), mapOptions);
	rectangleOptions = {
			fillColor: '#ffff00',
			fillOpacity: 0.2,
			strokeWeight: 2,
			clickable: false,
			zIndex: 1,
			editable: true
		};
	drawingManager = new google.maps.drawing.DrawingManager({
		drawingMode: google.maps.drawing.OverlayType.RECTANGLE,
		drawingControl: true,
		drawingControlOptions: {
			position: google.maps.ControlPosition.TOP_CENTER,
			drawingModes: [ google.maps.drawing.OverlayType.RECTANGLE ]
		},
		rectangleOptions: rectangleOptions
	});
	drawingManager.setMap(sianctdemoMap);
	currentBBox = new google.maps.Rectangle(rectangleOptions);
	currentBBox.setMap(sianctdemoMap);
	google.maps.event.addListener(drawingManager, 'rectanglecomplete', 
			function(bBox) {
				sianctdemoClear();
				drawingManager.setDrawingMode(null);
				currentBBox = bBox;
				sianctdemoBBoxDrawn(bBox);
				google.maps.event.addListener(bBox, 'bounds_changed', 
						function() {
							sianctdemoBBoxDrawn(currentBBox);
						    sianctdemoStatusLine('Bounding box drawn');
						}
				);
			}
	);
}

function sianctdemoBBoxDrawn(bBox) {
	document.getElementById("sianctdemoNorth").value = bBox.getBounds().getNorthEast().lat();
	document.getElementById("sianctdemoEast").value = bBox.getBounds().getNorthEast().lng();
	document.getElementById("sianctdemoSouth").value = bBox.getBounds().getSouthWest().lat();
	document.getElementById("sianctdemoWest").value = bBox.getBounds().getSouthWest().lng();
	sianctdemoMap.fitBounds(bBox.getBounds());
	document.getElementById('sianctdemoGeoFilterCheckbox').checked = true;
	document.getElementById('sianctdemoGeoFilterDiv').style.display = '';
	sianctdemoShowFilters();
//	document.getElementById("sianctdemoClearButton").disabled = "";
}

function sianctdemoBBoxChanged() {
	var south = document.getElementById("sianctdemoSouth").value;
	var north = document.getElementById("sianctdemoNorth").value;
	var east = document.getElementById("sianctdemoEast").value;
	var west = document.getElementById("sianctdemoWest").value;
	if (isNaN(south)) { south = '-45'; document.getElementById("sianctdemoSouth").value = south; }
	if (isNaN(north)) { north = '45'; document.getElementById("sianctdemoNorth").value = north; }
	if (isNaN(west)) { west = '-45'; document.getElementById("sianctdemoWest").value = west; }
	if (isNaN(east)) { east = '45'; document.getElementById("sianctdemoEast").value = east; }
	if ( north>90 || north<-90 || south>90 || south<-90 || west>180 || west<-180 || east>180 || east<-180 ) {
		alert("Coordinates not within bounds south,west=("+south+","+west+") north,east=("+north+","+east+")");
		return;
	}
	if (north <= south) {
		alert("Coordinates wrong, north="+north+" must be larger than south="+south);
		return;
	}
	currentBBox.setBounds(new google.maps.LatLngBounds(new google.maps.LatLng(south, west), new google.maps.LatLng(north, east))); 
	sianctdemoMap.fitBounds(currentBBox.getBounds());
//	document.getElementById("sianctdemoClearButton").disabled = "";
}

function sianctdemoShowGeoDiv() {
	document.getElementById('sianctdemoGeoFilterDiv').style.display='';
}

function sianctdemoShowFilters() {
	document.getElementById('sianctdemoFiltersArea').style.display='';
	document.getElementById('sianctdemoShowFilters').style.display='none';
	document.getElementById('sianctdemoHideFilters').style.display='';
}

function sianctdemoHideFilters() {
	document.getElementById('sianctdemoFiltersArea').style.display='none';
	document.getElementById('sianctdemoShowFilters').style.display='';
	document.getElementById('sianctdemoHideFilters').style.display='none';
}

function sianctdemoShowProjectTree() {
	document.getElementById('sianctdemoProjectStructureArea').style.display='';
	document.getElementById('sianctdemoShowProjectTree').style.display='none';
	document.getElementById('sianctdemoHideProjectTree').style.display='';
}

function sianctdemoHideProjectTree() {
	document.getElementById('sianctdemoProjectStructureArea').style.display='none';
	document.getElementById('sianctdemoShowProjectTree').style.display='';
	document.getElementById('sianctdemoHideProjectTree').style.display='none';
}

function sianctdemoItemClick(item) {
	var pid = item.id.substring("item".length);
	var menu = document.getElementById("menu"+pid);
	menu.style.backgroundColor = "#888888";
	menu.style.border = "thin solid";
	menu.style.zIndex = "101";
	menu.style.position = "absolute";
	menu.style.left = "100px";
	menu.style.display = "";
}

function sianctdemoItemOver(item) {
	item.style.backgroundColor = "#dddddd";
}

function sianctdemoItemOut(item) {
	item.style.backgroundColor = "#eedd99";
	var pid = item.id.substring("item".length);
	var menu = document.getElementById("menu"+pid);
	menu.style.display = "none";
}

function sianctdemoMenuOver(menu) {
	menu.style.display = "";
}

function sianctdemoMenuOut(menu) {
	menu.style.display = "none";
}

function sianctdemoProjectShow(projectShowA) {
	projectPid = projectShowA.id.substring("projectShowA".length);
	var projectElement = document.getElementById("item"+projectPid);
	var parkElement = projectElement.nextSibling;
	while (parkElement && parkElement.className != "sianctdemoProjectItem") {
		if (parkElement.className == "sianctdemoParkItem") {
			parkElement.style.display = "";
		}
		parkElement = parkElement.nextSibling;
	}
	var latElement = projectElement.firstChild;
	while (latElement && latElement.localName != "span") {
		latElement = latElement.nextSibling;
	}
	if (latElement && latElement.localName == "span") {
		var lonElement = latElement.nextSibling;
		while (lonElement && lonElement.localName != "span") {
			lonElement = lonElement.nextSibling;
		}
		if (lonElement && lonElement.localName == "span") {
			sianctdemoMap.setCenter(new google.maps.LatLng(latElement.textContent,lonElement.textContent));
			sianctdemoMap.setZoom(5);
			drawingManager.setDrawingMode(null);
		}
	}
	return false;
}

function sianctdemoProjectHide(projectHideA) {
	projectPid = projectHideA.id.substring("projectHideA".length);
	var projectElement = document.getElementById("item"+projectPid);
	var parkElement = projectElement.nextSibling;
	while (parkElement && parkElement.className != "sianctdemoProjectItem") {
		if (parkElement.className == "sianctdemoParkItem") {
			parkElement.style.display = "none";
			sianctdemoParkHide(document.getElementById("parkHideA"+parkElement.id.substring("item".length)));
		}
		parkElement = parkElement.nextSibling;
	}
	return false;
}

function sianctdemoProjectSelect(projectElement) {
	projectPid = projectElement.id.substring("item".length);
	var parkElement = projectElement.nextSibling;
	while (parkElement && parkElement.className != "sianctdemoProjectItem") {
		if (parkElement.className == "sianctdemoParkItem") {
			parkElement.style.display = "";
			sianctdemoParkSelect(parkElement);
		}
		parkElement = parkElement.nextSibling;
	}
	return false;
}

function sianctdemoProjectDeselect(projectElement) {
	var parkElement = projectElement.nextSibling;
	while (parkElement && parkElement.className != "sianctdemoProjectItem") {
		if (parkElement.className == "sianctdemoParkItem") {
			sianctdemoParkDeselect(parkElement);
		}
		parkElement = parkElement.nextSibling;
	}
	return false;
}

function sianctdemoParkShow(parkShowA) {
	parkPid = parkShowA.id.substring("parkShowA".length);
	var parkElement = document.getElementById("item"+parkPid);
	var siteElement = parkElement.nextSibling;
	while (siteElement && siteElement.className != "sianctdemoParkItem" && siteElement.className != "sianctdemoProjectItem") {
		if (siteElement.className == "sianctdemoSiteItem") {
			siteElement.style.display = "";
		}
		siteElement = siteElement.nextSibling;
	}
	return false;
}

function sianctdemoParkHide(parkHideA) {
	parkPid = parkHideA.id.substring("parkHideA".length);
	var parkElement = document.getElementById("item"+parkPid);
	var siteElement = parkElement.nextSibling;
	while (siteElement && siteElement.className != "sianctdemoParkItem" && siteElement.className != "sianctdemoProjectItem") {
		if (siteElement.className == "sianctdemoSiteItem") {
			siteElement.style.display = "none";
			sianctdemoSiteHide(document.getElementById("siteHideA"+siteElement.id.substring("item".length)));
		}
		siteElement = siteElement.nextSibling;
	}
	return false;
}

function sianctdemoParkSelect(parkElement) {
	parkPid = parkElement.id.substring("item".length);
	var siteElement = parkElement.nextSibling;
	while (siteElement && siteElement.className != "sianctdemoParkItem" && siteElement.className != "sianctdemoProjectItem") {
		if (siteElement.className == "sianctdemoSiteItem") {
			siteElement.style.display = "";
			sianctdemoSiteSelect(siteElement);
		}
		siteElement = siteElement.nextSibling;
	}
	return false;
}

function sianctdemoParkDeselect(parkElement) {
	var siteElement = parkElement.nextSibling;
	while (siteElement && siteElement.className != "sianctdemoParkItem" && siteElement.className != "sianctdemoProjectItem") {
		if (siteElement.className == "sianctdemoSiteItem") {
			sianctdemoSiteDeselect(siteElement);
		}
		siteElement = siteElement.nextSibling;
	}
	return false;
}

function sianctdemoSiteShow(siteShowA) {
	sitePid = siteShowA.id.substring("siteShowA".length);
	var siteElement = document.getElementById("item"+sitePid);
	var cameratrapElement = siteElement.nextSibling;
	while (cameratrapElement && cameratrapElement.className != "sianctdemoSiteItem" && cameratrapElement.className != "sianctdemoParkItem" && cameratrapElement.className != "sianctdemoProjectItem") {
		if (cameratrapElement.className == "sianctdemoCameratrapItem") {
			cameratrapElement.style.display = "";
		}
		cameratrapElement = cameratrapElement.nextSibling;
	}
	return false;
}

function sianctdemoSiteHide(siteHideA) {
	sitePid = siteHideA.id.substring("siteHideA".length);
	var siteElement = document.getElementById("item"+sitePid);
	var cameratrapElement = siteElement.nextSibling;
	while (cameratrapElement && cameratrapElement.className != "sianctdemoSiteItem" && cameratrapElement.className != "sianctdemoParkItem" && cameratrapElement.className != "sianctdemoProjectItem") {
		if (cameratrapElement.className == "sianctdemoCameratrapItem") {
			cameratrapElement.style.display = "none";
			sianctdemoCameratrapHide(document.getElementById("cameratrapHideA"+cameratrapElement.id.substring("item".length)));
		}
		cameratrapElement = cameratrapElement.nextSibling;
	}
	return false;
}

function sianctdemoSiteSelect(siteElement) {
	sitePid = siteElement.id.substring("item".length);
	var cameratrapElement = siteElement.nextSibling;
	while (cameratrapElement && cameratrapElement.className != "sianctdemoSiteItem" && cameratrapElement.className != "sianctdemoParkItem" && cameratrapElement.className != "sianctdemoProjectItem") {
		if (cameratrapElement.className == "sianctdemoCameratrapItem") {
			cameratrapElement.style.display = "";
			sianctdemoCameratrapSelect(cameratrapElement);
		}
		cameratrapElement = cameratrapElement.nextSibling;
	}
	return false;
}

function sianctdemoSiteDeselect(siteElement) {
	var cameratrapElement = siteElement.nextSibling;
	while (cameratrapElement && cameratrapElement.className != "sianctdemoSiteItem" && cameratrapElement.className != "sianctdemoParkItem" && cameratrapElement.className != "sianctdemoProjectItem") {
		if (cameratrapElement.className == "sianctdemoCameratrapItem") {
			sianctdemoCameratrapDeselect(cameratrapElement);
		}
		cameratrapElement = cameratrapElement.nextSibling;
	}
	return false;
}

function sianctdemoCameratrapShow(cameratrapShowA) {
	cameratrapPid = cameratrapShowA.id.substring("cameratrapShowA".length);
	var cameratrapElement = document.getElementById("item"+cameratrapPid);
	var obstableElement = cameratrapElement.nextSibling;
	while (obstableElement && obstableElement.className != "sianctdemoCameratrapItem" && obstableElement.className != "sianctdemoSiteItem" && obstableElement.className != "sianctdemoParkItem" && obstableElement.className != "sianctdemoProjectItem") {
		if (obstableElement.className == "sianctdemoObstableItem") {
			obstableElement.style.display = "";
		}
		obstableElement = obstableElement.nextSibling;
	}
	return false;
}

function sianctdemoCameratrapHide(cameratrapHideA) {
	cameratrapPid = cameratrapHideA.id.substring("cameratrapHideA".length);
	var cameratrapElement = document.getElementById("item"+cameratrapPid);
	var obstableElement = cameratrapElement.nextSibling;
	while (obstableElement && obstableElement.className != "sianctdemoCameratrapItem" && obstableElement.className != "sianctdemoSiteItem" && obstableElement.className != "sianctdemoParkItem" && obstableElement.className != "sianctdemoProjectItem") {
		if (obstableElement.className == "sianctdemoObstableItem") {
			obstableElement.style.display = "none";
		}
		obstableElement = obstableElement.nextSibling;
	}
	return false;
}

function sianctdemoCameratrapSelect(cameratrapElement) {
	cameratrapPid = cameratrapElement.id.substring("item".length);
	var obstableElement = cameratrapElement.nextSibling;
	while (obstableElement && obstableElement.className != "sianctdemoCameratrapItem" && obstableElement.className != "sianctdemoSiteItem" && obstableElement.className != "sianctdemoParkItem" && obstableElement.className != "sianctdemoProjectItem") {
		if (obstableElement.className == "sianctdemoObstableItem") {
			obstableElement.style.display = "";
			for (var i=0; i<obstableElement.childNodes.length; i++) {
				var obstableCheckBoxElement = obstableElement.childNodes[i];
				if (obstableCheckBoxElement.nodeType == 1 && obstableCheckBoxElement.type == "checkbox") {
					obstableCheckBoxElement.checked = true;
					sianctdemoObstableClicked(obstableCheckBoxElement);
				}
			}
		}
		obstableElement = obstableElement.nextSibling;
	}
	return false;
}

function sianctdemoCameratrapDeselect(cameratrapElement) {
	var obstableElement = cameratrapElement.nextSibling;
	while (obstableElement && obstableElement.className != "sianctdemoCameratrapItem" && obstableElement.className != "sianctdemoSiteItem" && obstableElement.className != "sianctdemoParkItem" && obstableElement.className != "sianctdemoProjectItem") {
		if (obstableElement.className == "sianctdemoObstableItem") {
			for (var i=0; i<obstableElement.childNodes.length; i++) {
				var obstableCheckBoxElement = obstableElement.childNodes[i];
				if (obstableCheckBoxElement.nodeType == 1 && obstableCheckBoxElement.type == "checkbox") {
					obstableCheckBoxElement.checked = false;
					sianctdemoObstableClicked(obstableCheckBoxElement);
				}
			}
		}
		obstableElement = obstableElement.nextSibling;
	}
	return false;
}

function sianctdemoObstableCameraLocation(obstableElement) {
	var cameraLocation;
	var latElement = obstableElement.firstChild;
	while (latElement && latElement.localName != "span") {
		latElement = latElement.nextSibling;
	}
	if (latElement && latElement.localName == "span") {
		var lonElement = latElement.nextSibling;
		while (lonElement && lonElement.localName != "span") {
			lonElement = lonElement.nextSibling;
		}
		if (lonElement && lonElement.localName == "span") {
			cameraLocation = new google.maps.LatLng(latElement.textContent,lonElement.textContent);
		}
	}
	return cameraLocation;
}

function sianctdemoObstableClicked(obstableCheckBoxElement) {
	var obstableElement = obstableCheckBoxElement.parentNode;
	var cameraLocation = sianctdemoObstableCameraLocation(obstableElement);
	var markerTitle = document.getElementById(obstableCheckBoxElement.value+"Label").textContent;
	sianctdemoObstableSwitch(obstableCheckBoxElement, markerTitle, cameraLocation);
	sianctdemoSetRunWorkflowButton(document.getElementById("sianctdemoWorkflowSelect"));
}

function sianctdemoObstableSwitch(obstableCheckBoxElement, markerTitle, cameraLocation) {
	if (obstableCheckBoxElement.checked && !obstableCheckBoxElement.disabled) {
		obstableCheckBoxElement.title = "Deselect the ObservationTable";
		for (var i=0; i<markersArray.length; i++) {
			var marker = markersArray[i];
			if (marker.getTitle() == markerTitle) {
				return;
			}
		}
		sianctdemoMap.setCenter(cameraLocation);
		sianctdemoSetMarker(cameraLocation, obstableCheckBoxElement.value, markerTitle);
	} else {
		obstableCheckBoxElement.title = "Select the ObservationTable";
		for (var i=0; i<markersArray.length; i++) {
			var marker = markersArray[i];
			if (marker.getTitle() == markerTitle) {
				sianctdemoClearMarker(markersArray[i]);
				markersArray.splice(i, 1);
			}
		}
	}
}

function sianctdemoClear() {
	sianctdemoHideProjectTree();
	sianctdemoClearMarkers();
	sianctdemoClearObstables();
	currentBBox.setMap(null);
	document.getElementById("sianctdemoClearButton").disabled = "true";
	drawingManager.setDrawingMode(google.maps.drawing.OverlayType.RECTANGLE);
	currentBBox = new google.maps.Rectangle(rectangleOptions);
	currentBBox.setMap(sianctdemoMap);
    sianctdemoStatusLine('Selection cleared');
	sianctdemoSetRunWorkflowButton(document.getElementById("sianctdemoWorkflowSelect"));
}

function sianctdemoShowSelection() {
	sianctdemoHideProjectTree();
	sianctdemoClearMarkers();
	sianctdemoClearObstables();
	var resultElement = document.getElementById("sianctSelectObstablesResult");
	if (!resultElement.firstChild) return;
	var resultElementChild = resultElement.firstChild;
	while (resultElementChild && resultElementChild.localName != "span") {
		if (resultElementChild.localName == "div") {
			var resultElementChildId = resultElementChild.textContent;
			if (document.getElementById(resultElementChildId+"Label")) {
				var resultElementChildTitle = document.getElementById(resultElementChildId+"Label").textContent;
				var resultElementChildLat = document.getElementById(resultElementChildId+"Lat").textContent;
				var resultElementChildLon = document.getElementById(resultElementChildId+"Lon").textContent;
				var cameraLocation = new google.maps.LatLng(resultElementChildLat,resultElementChildLon);
				sianctdemoMap.setCenter(cameraLocation);
				sianctdemoSetMarker(cameraLocation, resultElementChildId, resultElementChildTitle);
				var inputNodes = document.getElementsByTagName("input");
				for (var i=0; i<inputNodes.length; i++) {
					var inputNode = inputNodes[i];
					if (inputNode.value == resultElementChildId && inputNode.type == 'checkbox') {
						inputNode.checked = true;
						inputNode.title = "Deselect the ObservationTable";
						var obstableElement = inputNode.parentNode;
						obstableElement.style.display = "";
						var cameratrapElement = obstableElement.previousSibling;
						while (cameratrapElement && cameratrapElement.className != "sianctdemoCameratrapItem") {
							cameratrapElement = cameratrapElement.previousSibling;
						}
						cameratrapElement.style.display = "";
						var siteElement = cameratrapElement.previousSibling;
						while (siteElement && siteElement.className != "sianctdemoSiteItem") {
							siteElement = siteElement.previousSibling;
						}
						siteElement.style.display = "";
						var parkElement = siteElement.previousSibling;
						while (parkElement && parkElement.className != "sianctdemoParkItem") {
							parkElement = parkElement.previousSibling;
						}
						parkElement.style.display = "";
						var projectElement = parkElement.previousSibling;
						while (projectElement && projectElement.className != "sianctdemoProjectItem") {
							projectElement = projectElement.previousSibling;
						}
						projectElement.style.display = "";
					}
				}
			}
		}
		resultElementChild = resultElementChild.nextSibling;
	}
	sianctdemoSetRunWorkflowButton(document.getElementById("sianctdemoWorkflowSelect"));
	sianctdemoShowProjectTree();
}

function sianctdemoAllSpeciesNamesFilterClicked() {
	var speciesFilterCheckboxChecked = (document.getElementById("sianctdemoAllSpeciesFilterCheckbox")).checked;
	if (speciesFilterCheckboxChecked) {
		document.getElementById('sianctdemoAllSpeciesFilterDiv').style.display='';
		document.getElementById('sianctdemoAllSpeciesFilterCheckbox').title='Click to hide filter for all species names';
	} else {
		document.getElementById('sianctdemoAllSpeciesFilterDiv').style.display='none';
		document.getElementById('sianctdemoAllSpeciesFilterCheckbox').title='Click to show filter for all species names';
	}
}

function sianctdemoIdtypeFilterClicked() {
	var idtypeFilterCheckboxChecked = (document.getElementById("sianctdemoIdtypeFilterCheckbox")).checked;
	if (idtypeFilterCheckboxChecked) {
		document.getElementById('sianctdemoIdtypeFilterDiv').style.display='';
		document.getElementById('sianctdemoIdtypeFilterCheckbox').title='Click to hide filter for Id Type';
	} else {
		document.getElementById('sianctdemoIdtypeFilterDiv').style.display='none';
		document.getElementById('sianctdemoIdtypeFilterCheckbox').title='Click to show filter for Id Type';
	}
}

function sianctdemoGeoFilterClicked() {
	var geoFilterCheckboxChecked = (document.getElementById("sianctdemoGeoFilterCheckbox")).checked;
	if (geoFilterCheckboxChecked) {
		document.getElementById('sianctdemoGeoFilterDiv').style.display='';
		document.getElementById('sianctdemoGeoFilterCheckbox').title='Click to hide filter for geographic bounding box';
	} else {
		document.getElementById('sianctdemoGeoFilterDiv').style.display='none';
		document.getElementById('sianctdemoGeoFilterCheckbox').title='Click to show filter for geographic bounding box';
	}
}

function sianctdemoDatesFilterClicked() {
	var datesFilterCheckboxChecked = (document.getElementById("sianctdemoDatesFilterCheckbox")).checked;
	if (datesFilterCheckboxChecked) {
		document.getElementById('sianctdemoDatesFilterDiv').style.display='';
		document.getElementById('sianctdemoDatesFilterCheckbox').title='Click to hide filter for dates';
	} else {
		document.getElementById('sianctdemoDatesFilterDiv').style.display='none';
		document.getElementById('sianctdemoDatesFilterCheckbox').title='Click to show filter for dates';
	}
}

function sianctdemoSetMarker(cameraLocation, obstablePid, markerTitle) {
	var marker = new google.maps.Marker({
		position: cameraLocation,
		map: sianctdemoMap,
		title: markerTitle
		}); 
	markersArray.push(marker);
	var infoNode = document.getElementById(obstablePid+"Info");
	marker.infoWindow = new google.maps.InfoWindow({
		content: infoNode.innerHTML
	});
	google.maps.event.addListener(marker, 'click', function() {
		marker.infoWindow.open(sianctdemoMap, marker);
	}); 
}

function sianctdemoClearMarkers() {
	for (var i=0; i<markersArray.length; i++) {
		sianctdemoClearMarker(markersArray[i]);
	}
	markersArray = [];
}

function sianctdemoClearObstables() {
	var inputNodes = document.getElementsByTagName("input");
	for (var i=0; i<inputNodes.length; i++) {
		var inputNode = inputNodes[i];
		if (inputNode.name == 'obstable' && inputNode.type == 'checkbox') {
			inputNode.checked = false;
		}
	}
}

function sianctdemoClearMarker(marker) {
	marker.infoWindow.setMap(null);
	marker.infoWindow = null;
	marker.setMap(null);
}

function sianctdemoWorkflowSelected(selectWorkflowElement) {
	sianctdemoGetObstables();
	var i = selectWorkflowElement.selectedIndex;
    var elementId = "sianctdemoWorkflowsInput"+i;
    var element = document.getElementById(elementId);
    var inputNames = element.textContent;
//	document.getElementById("sianctdemoSelectObservationTables").style.display = "";
	if (inputNames.indexOf('species_name')==-1) {
		document.getElementById("sianctdemoSpecies").disabled = "true";
		document.getElementById("sianctdemoGetSpeciesButton").disabled = "true";
		document.getElementById("sianctdemoSpecies").selectedIndex = 0;
		speciesName = ' '; 
	} else {
		document.getElementById("sianctdemoSpecies").disabled = "";
		document.getElementById("sianctdemoGetSpeciesButton").disabled = "";
	}
	if (i>-1) {
		var selectedOptionElement = selectWorkflowElement.options[i];
		workflowName = selectedOptionElement.value;
	}
	sianctdemoSetRunWorkflowButton(selectWorkflowElement);
}

function sianctdemoSetRunWorkflowButton(selectWorkflowElement) {
	sianctdemoGetObstables();
	var i = selectWorkflowElement.selectedIndex;
	if (i<0) return;
    var elementId = "sianctdemoWorkflowsInput"+i;
    var element = document.getElementById(elementId);
    var inputNames = element.textContent;
	if (inputNames.indexOf('species_name')==-1) {
		if (obstablePids=="") {
			document.getElementById("sianctdemoRunWorkflowButton").disabled = "true";
		} else {
			document.getElementById("sianctdemoRunWorkflowButton").disabled = "";
		}
	} else {
		if (obstablePids=="" || speciesName==" ") {
			document.getElementById("sianctdemoRunWorkflowButton").disabled = "true";
		} else {
			document.getElementById("sianctdemoRunWorkflowButton").disabled = "";
		}
	}
}

function sianctdemoSpeciesSelected(selectSpeciesElement) {
	var i = selectSpeciesElement.selectedIndex;
	if (i>-1) {
		var selectedOptionElement = selectSpeciesElement.options[i];
		speciesName = selectedOptionElement.value;
	}
	sianctdemoSetRunWorkflowButton(document.getElementById("sianctdemoWorkflowSelect"));
}

function sianctdemoGetObstables() {
	obstablePids = "";
	obstablesInit = "";
	obstablesSelected = 0;
	var infoElement = document.getElementById("sianctGetProjectStructureResult");
	if (!infoElement) return;
	var infoElementChild = infoElement.firstChild;
	while (infoElementChild && infoElementChild.localName != "span") {
		if (infoElementChild.localName == "div" && infoElementChild.className == "sianctdemoObstableItem") {
			var infoElementChildChecked = false;
			var infoElementChildDisabled = false;
			var infoElementChildId = "";
			for (var j=0; j<infoElementChild.childNodes.length; j++) {
				var infoElementChildChild = infoElementChild.childNodes[j];
				if (infoElementChildChild.nodeType == 1 && infoElementChildChild.type == "checkbox") {
					infoElementChildChecked = infoElementChildChecked || infoElementChildChild.checked;
					infoElementChildDisabled = infoElementChildDisabled || infoElementChildChild.disabled;
					infoElementChildId = infoElementChildChild.value;
				}
			}
			if (infoElementChildChecked && !infoElementChildDisabled) {
				var infoElementChildTitle = document.getElementById(infoElementChildId+"Label").textContent;
				if (obstablePids) {
					obstablePids += ", ";
				}
				obstablesSelected = obstablesSelected+1;
				obstablePids += infoElementChildId;
				obstablesInit += '<br/>'+sianctdemoGetDateTime()+' with Observation Table: '+infoElementChildTitle+' ('+infoElementChildId+')';
			}
		}
		infoElementChild = infoElementChild.nextSibling;
	}
	if (obstablesSelected == 0) {
		obstablesSelected = '0';
		document.getElementById("sianctdemoClearButton").disabled = "true";
	} else {
		document.getElementById("sianctdemoClearButton").disabled = "";
	}
    $('#sianctdemoSelectedObstablesCount').html(obstablesSelected);
}

function sianctdemoRun() {
	var workflowSelect = document.getElementById("sianctdemoWorkflowSelect");
	var workflowSelectedOption = workflowSelect.options[workflowSelect.selectedIndex];
	var workflowInit = sianctdemoGetDateTime()+' Initializing Workflow: '+workflowSelectedOption.textContent+' ('+workflowSelectedOption.value+')';
	sianctdemoGetObstables();
    $('#sianctdemoStatusArea').html(workflowInit);
	document.getElementById("sianctdemoStatusDiv").style.display = "";
	UUID = "";
	var url = '/gflow/gflowRun/'+workflowName;
	$('#sianctdemoAjaxArea').load(
			encodeURI(url)+' #gflowResult',
			function(response, status, xhr) {
				if (status == 'error') {
				    sianctdemoStatusLine('Error: '+xhr.status+' '+xhr.statusText);
				} else {
					if ($('#sianctdemoAjaxArea').text().indexOf('GFLOW ERROR')>-1) {
					    sianctdemoStatusLine($('#sianctdemoAjaxArea').text());
					} else {
						UUID = $('#sianctdemoAjaxArea').text();
					    sianctdemoStatusLine('Initialized : UUID='+UUID);
					    var inputs = new Array('pids_of_observation_tables', obstablePids);
					    if (speciesName != " ") {
					    	inputs.push('species_name');
					    	inputs.push(speciesName);
					    }
					    sianctdemoSetInputs(UUID, inputs);
					}
				}
			}
	);
}

function sianctdemoSetInputs(UUID, inputs) {
	var inputName = inputs.shift();
	var inputValue = inputs.shift();
	var url = '/gflow/gflowSetInput/'+UUID;
	$('#sianctdemoAjaxArea').load(
			encodeURI(url)+' #gflowResult',
			{inputName: inputName, inputValue: inputValue},
			function(response, status, xhr) {
				if (status == 'error') {
				    sianctdemoStatusLine('Error: '+xhr.status+' '+xhr.statusText);
				} else {
					tavernaStatus = $('#sianctdemoAjaxArea').text();
				    sianctdemoStatusLine(tavernaStatus);
				    if (inputs.length > 0) {
					    sianctdemoSetInputs(UUID, inputs);
				    } else {
				    	sianctdemoSetStatus(UUID, 'Operating');
				    }
				}
			}
	);
}

function sianctdemoSetStatus(UUID, newStatus) {
	var url = '/gflow/gflowSetStatus/'+UUID+'/'+newStatus;
	$('#sianctdemoAjaxArea').load(
			encodeURI(url)+' #gflowResult',
			function(response, status, xhr) {
				if (status == 'error') {
				    sianctdemoStatusLine('Error: '+xhr.status+' '+xhr.statusText);
				} else {
					tavernaStatus = $('#sianctdemoAjaxArea').text();
				    sianctdemoStatusLine(tavernaStatus);
				    if (tavernaStatus == 'Operating') {
				    	window.setTimeout("sianctdemoWaitFinish(UUID)",3000);
				    } else {
					    if (tavernaStatus == 'Finished') {
					    	sianctdemoWaitFinish(UUID);
					    } else {
						    sianctdemoStatusLine('Error:<BR/>'+$('#sianctdemoAjaxArea').text());
					    }
				    }
				}
			}
	);
}

function sianctdemoWaitFinish(UUID) {
	var url = '/gflow/gflowWaitFinish/'+UUID;
	$('#sianctdemoAjaxArea').load(
			encodeURI(url)+' #gflowResult',
			function(response, status, xhr) {
				if (status == 'error') {
				    sianctdemoStatusLine('Error: '+xhr.status+' '+xhr.statusText);
				} else {
					tavernaStatus = $('#sianctdemoAjaxArea').text();
				    sianctdemoStatusLine(tavernaStatus);
				    if (tavernaStatus == 'Operating') {
				    	window.setTimeout("sianctdemoWaitFinish(UUID)",3000);
				    } else {
					    if (tavernaStatus == 'Finished') {
					    	sianctdemoGetResult(UUID);
					    } else {
						    sianctdemoStatusLine('Error:<BR/>'+$('#sianctdemoAjaxArea').text());
					    }
				    }
				}
			}
	);
}

function sianctdemoGetResult(UUID) {
	var url = '/gflow/gflowGetResult/'+UUID;
	$('#sianctdemoAjaxArea').load(
			encodeURI(url)+' #gflowResult',
			function(response, status, xhr) {
				if (status == 'error') {
				    sianctdemoStatusLine('Error: '+xhr.status+' '+xhr.statusText);
				} else {
					if ($('#sianctdemoAjaxArea').text().indexOf('GFLOW ERROR')>-1) {
					    sianctdemoStatusLine($('#sianctdemoAjaxArea').text());
					} else {
					    sianctdemoStatusLine('<a id="sianctdemoResultButton" target="'+UUID+'" href="'+$('#sianctdemoAjaxArea').text()+'">Retrieve the Result</a><br/>');
					}
				}
			}
	);
}
