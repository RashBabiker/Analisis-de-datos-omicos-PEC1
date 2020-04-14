// (C) Wolfgang Huber 2010-2011

// Script parameters - these are set up by R in the function 'writeReport' when copying the 
//   template for this script from arrayQualityMetrics/inst/scripts into the report.

var highlightInitial = [ false, true, false, true, false, true, false, true, true, true, true, true, false, true, false, false, false, false, true, false, true, true ];
var arrayMetadata    = [ [ "1", "cHL1", "GSM312811", "cHL", "primary lymphoma cells laser-microdissected from a patient diagnosed with classical Hodgkin lymphoma (cHL)" ], [ "2", "cHL2", "GSM312812", "cHL", "primary lymphoma cells laser-microdissected from a patient diagnosed with classical Hodgkin lymphoma (cHL)" ], [ "3", "cHL3", "GSM312813", "cHL", "primary lymphoma cells laser-microdissected from a patient diagnosed with classical Hodgkin lymphoma (cHL)" ], [ "4", "cHL4", "GSM312814", "cHL", "primary lymphoma cells laser-microdissected from a patient diagnosed with classical Hodgkin lymphoma (cHL)" ], [ "5", "cHL5", "GSM312815", "cHL", "primary lymphoma cells laser-microdissected from a patient diagnosed with classical Hodgkin lymphoma (cHL)" ], [ "6", "cHL6", "GSM312816", "cHL", "primary lymphoma cells laser-microdissected from a patient diagnosed with classical Hodgkin lymphoma (cHL)" ], [ "7", "cHL7", "GSM312817", "cHL", "primary lymphoma cells laser-microdissected from a patient diagnosed with classical Hodgkin lymphoma (cHL)" ], [ "8", "cHL8", "GSM312818", "cHL", "primary lymphoma cells laser-microdissected from a patient diagnosed with classical Hodgkin lymphoma (cHL)" ], [ "9", "cHL9", "GSM312819", "cHL", "primary lymphoma cells laser-microdissected from a patient diagnosed with classical Hodgkin lymphoma (cHL)" ], [ "10", "cHL10", "GSM312820", "cHL", "primary lymphoma cells laser-microdissected from a patient diagnosed with classical Hodgkin lymphoma (cHL)" ], [ "11", "cHL11", "GSM312821", "cHL", "primary lymphoma cells laser-microdissected from a patient diagnosed with classical Hodgkin lymphoma (cHL)" ], [ "12", "cHL12", "GSM312822", "cHL", "primary lymphoma cells laser-microdissected from a patient diagnosed with classical Hodgkin lymphoma (cHL)" ], [ "13", "NLPHL1", "GSM312823", "NLPHL", "primary lymphoma cells laser-microdissected from a patient diagnosed with nodular lymphocyte-predominant Hodgkin lymphoma (NLPHL)" ], [ "14", "NLPHL2", "GSM312824", "NLPHL", "primary lymphoma cells laser-microdissected from a patient diagnosed with nodular lymphocyte-predominant Hodgkin lymphoma (NLPHL)" ], [ "15", "NLPHL3", "GSM312825", "NLPHL", "primary lymphoma cells laser-microdissected from a patient diagnosed with nodular lymphocyte-predominant Hodgkin lymphoma (NLPHL)" ], [ "16", "NLPHL4", "GSM312826", "NLPHL", "primary lymphoma cells laser-microdissected from a patient diagnosed with nodular lymphocyte-predominant Hodgkin lymphoma (NLPHL)" ], [ "17", "NLPHL5", "GSM312839", "NLPHL", "primary lymphoma cells laser-microdissected from a patient diagnosed with nodular lymphocyte-predominant Hodgkin lymphoma (NLPHL)" ], [ "18", "CB1", "GSM312937", "CB", "centroblasts, isolated from tonsils by fluorescence-activated cell sorting" ], [ "19", "CB2", "GSM312938", "CB", "centroblasts, isolated from tonsils by fluorescence-activated cell sorting" ], [ "20", "CB3", "GSM312939", "CB", "centroblasts, isolated from tonsils by fluorescence-activated cell sorting" ], [ "21", "CB4", "GSM312940", "CB", "centroblasts, isolated from tonsils by fluorescence-activated cell sorting" ], [ "22", "CB5", "GSM312941", "CB", "centroblasts, isolated from tonsils by fluorescence-activated cell sorting" ] ];
var svgObjectNames   = [ "pca", "dens" ];

var cssText = ["stroke-width:1; stroke-opacity:0.4",
               "stroke-width:3; stroke-opacity:1" ];

// Global variables - these are set up below by 'reportinit'
var tables;             // array of all the associated ('tooltips') tables on the page
var checkboxes;         // the checkboxes
var ssrules;


function reportinit() 
{
 
    var a, i, status;

    /*--------find checkboxes and set them to start values------*/
    checkboxes = document.getElementsByName("ReportObjectCheckBoxes");
    if(checkboxes.length != highlightInitial.length)
	throw new Error("checkboxes.length=" + checkboxes.length + "  !=  "
                        + " highlightInitial.length="+ highlightInitial.length);
    
    /*--------find associated tables and cache their locations------*/
    tables = new Array(svgObjectNames.length);
    for(i=0; i<tables.length; i++) 
    {
        tables[i] = safeGetElementById("Tab:"+svgObjectNames[i]);
    }

    /*------- style sheet rules ---------*/
    var ss = document.styleSheets[0];
    ssrules = ss.cssRules ? ss.cssRules : ss.rules; 

    /*------- checkboxes[a] is (expected to be) of class HTMLInputElement ---*/
    for(a=0; a<checkboxes.length; a++)
    {
	checkboxes[a].checked = highlightInitial[a];
        status = checkboxes[a].checked; 
        setReportObj(a+1, status, false);
    }

}


function safeGetElementById(id)
{
    res = document.getElementById(id);
    if(res == null)
        throw new Error("Id '"+ id + "' not found.");
    return(res)
}

/*------------------------------------------------------------
   Highlighting of Report Objects 
 ---------------------------------------------------------------*/
function setReportObj(reportObjId, status, doTable)
{
    var i, j, plotObjIds, selector;

    if(doTable) {
	for(i=0; i<svgObjectNames.length; i++) {
	    showTipTable(i, reportObjId);
	} 
    }

    /* This works in Chrome 10, ssrules will be null; we use getElementsByClassName and loop over them */
    if(ssrules == null) {
	elements = document.getElementsByClassName("aqm" + reportObjId); 
	for(i=0; i<elements.length; i++) {
	    elements[i].style.cssText = cssText[0+status];
	}
    } else {
    /* This works in Firefox 4 */
    for(i=0; i<ssrules.length; i++) {
        if (ssrules[i].selectorText == (".aqm" + reportObjId)) {
		ssrules[i].style.cssText = cssText[0+status];
		break;
	    }
	}
    }

}

/*------------------------------------------------------------
   Display of the Metadata Table
  ------------------------------------------------------------*/
function showTipTable(tableIndex, reportObjId)
{
    var rows = tables[tableIndex].rows;
    var a = reportObjId - 1;

    if(rows.length != arrayMetadata[a].length)
	throw new Error("rows.length=" + rows.length+"  !=  arrayMetadata[array].length=" + arrayMetadata[a].length);

    for(i=0; i<rows.length; i++) 
 	rows[i].cells[1].innerHTML = arrayMetadata[a][i];
}

function hideTipTable(tableIndex)
{
    var rows = tables[tableIndex].rows;

    for(i=0; i<rows.length; i++) 
 	rows[i].cells[1].innerHTML = "";
}


/*------------------------------------------------------------
  From module 'name' (e.g. 'density'), find numeric index in the 
  'svgObjectNames' array.
  ------------------------------------------------------------*/
function getIndexFromName(name) 
{
    var i;
    for(i=0; i<svgObjectNames.length; i++)
        if(svgObjectNames[i] == name)
	    return i;

    throw new Error("Did not find '" + name + "'.");
}


/*------------------------------------------------------------
  SVG plot object callbacks
  ------------------------------------------------------------*/
function plotObjRespond(what, reportObjId, name)
{

    var a, i, status;

    switch(what) {
    case "show":
	i = getIndexFromName(name);
	showTipTable(i, reportObjId);
	break;
    case "hide":
	i = getIndexFromName(name);
	hideTipTable(i);
	break;
    case "click":
        a = reportObjId - 1;
	status = !checkboxes[a].checked;
	checkboxes[a].checked = status;
	setReportObj(reportObjId, status, true);
	break;
    default:
	throw new Error("Invalid 'what': "+what)
    }
}

/*------------------------------------------------------------
  checkboxes 'onchange' event
------------------------------------------------------------*/
function checkboxEvent(reportObjId)
{
    var a = reportObjId - 1;
    var status = checkboxes[a].checked;
    setReportObj(reportObjId, status, true);
}


/*------------------------------------------------------------
  toggle visibility
------------------------------------------------------------*/
function toggle(id){
  var head = safeGetElementById(id + "-h");
  var body = safeGetElementById(id + "-b");
  var hdtxt = head.innerHTML;
  var dsp;
  switch(body.style.display){
    case 'none':
      dsp = 'block';
      hdtxt = '-' + hdtxt.substr(1);
      break;
    case 'block':
      dsp = 'none';
      hdtxt = '+' + hdtxt.substr(1);
      break;
  }  
  body.style.display = dsp;
  head.innerHTML = hdtxt;
}
