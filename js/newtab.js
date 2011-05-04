
chrome.extension.sendRequest("fbldnbajhbkfjhgdibegkfedooodkpki", {getgestures:true}, function(resp) {if(resp&&resp.gestures)eval(resp.gestures);});
chrome.extension.sendRequest("lfkgmnnajiljnolcgolmmgnecgldgeld", {getgestures:true}, function(resp) {if(resp&&resp.gestures)eval(resp.gestures);});

var bg = chrome.extension.getBackgroundPage();
var ls = function(id, val) {
  if(val != undefined) {
    localStorage.setItem(id, JSON.stringify(val));
  } else {
    try {
      return JSON.parse(localStorage.getItem(id));
    } catch(ex) {}
    return null;
  }
}

var style = $("<style>").appendTo(document.head);
var refreshTheme = function() {
  if(bg.theme.bgImage) {
    if(!bg.objectURLs.themeBgImage) bg.objectURLs.themeBgImage = bg.dataUrlToObjectUrl(bg.theme.bgImage);
    $("body").css({"background-image":"url("+bg.objectURLs.themeBgImage+")",
                   "background-size":bg.theme.bgSize,
                   "background-repeat":bg.theme.bgRepeat,
                   "background-position":bg.theme.bgAlign})
  } else {
    $("body").css({"background-image":"",//"-webkit-gradient(linear, left 50%, left 95%, from(#FFF), to(#DDD))",//url('icon512t.png')",
                   "background-size":"auto",
                   "background-repeat":"no-repeat",
                   "background-position":"bottom left"});
  }
  $("body").css({"background-color":bg.theme.bgColor?bg.theme.bgColor:""});
  var colormatch = bg.theme.bgColor?bg.theme.bgColor.match(/rgba?\(([^,\)]*,[^,\)]*,[^,\)]*)/):null;
  var color = colormatch ? colormatch[1] : "255,255,255";
  style.text(".item .thumbborder { border-color: "+bg.theme.borderColor+"; background-color: rgba("+color+",.5); } "
//           + ".item .info { background: -webkit-gradient(linear, 0 0, 220 0, from(rgba("+color+",.4)), to(rgba("+color+",0))); border-radius: 3px; } "
           + ".item:hover .thumbborder { border-color: "+bg.theme.borderHoverColor+"; } "
           + "a.item, .itemnote { color: "+bg.theme.textColor+"; } "
           + "#titlebar, #optionsbutton, .footer a { color: "+bg.theme.linkColor+"; } "
           + "a.item, #titlebar { text-shadow: rgb("+color+") 0 0 3px; } "
           + "")
}
$(refreshTheme);

var editbookmark = $("<div id=editbookmark class=popover>").appendTo("body").append($("<div class=page>")
  .append($("<div class=close>").text("close").click(function() {
    editbookmark.animate({"opacity":0}, 200, function() { $(this).css({"display":"none"}) });
  }))
  .append($("<div class=title>").text("Edit Bookmark"))
  .append($("<div class=subtitle>").text("Title"))
  .append("<input type=text id=edittitle />")
  .append($("<div class=subtitle>").text("URL"))
  .append("<input type=text id=editurl />")
  .append($("<input type=button id=save>").val("Save Changes").click(function() {
    if(editbookmark.item && editbookmark.item.bmkid) {
      editbookmark.item.title = $("#edittitle", editbookmark).val();
      editbookmark.item.url = $("#editurl", editbookmark).val();
      chrome.bookmarks.update(editbookmark.item.bmkid, {title:editbookmark.item.title, url:editbookmark.item.url});
      $(".title", editbookmark.item.elem).text(editbookmark.item.title);
    }
    editbookmark.animate({"opacity":0}, 200, function() { $(this).css({"display":"none"}) });
  }))
  .append("<div class=clear>"))
editbookmark.item = null;
editbookmark.show = function(item) {
  editbookmark.item = item;
  editbookmark.css({"display":"block","opacity":"0"}).animate({"opacity":1}, 200);
  $(".page", editbookmark).animate({"height":"hide"},0).animate({"height":"show"}, 200);
  $("#edittitle", editbookmark).val(item.title);
  $("#editurl", editbookmark).val(item.url);
}

var setthumb = $("<div id=setthumb class=popover>").appendTo("body").append($("<div class=page>")
  .append($("<div class=close>").text("close").click(function() {
    setthumb.animate({"opacity":0}, 200, function() { $(this).css({"display":"none"}) });
  }))
  .append($("<div class=title>").text("Set Thumbnail"))
  .append($("<div class=subtitle>").text("URL")
    .append($("<div class=descrip>").text("use * as wildcard").css({"display":"inline", "padding":"1em"})))
  .append("<input type=text id=editurl />")
  .append($("<div class=subtitle id=imgsubtitle>").text("Image Choices:"))
  .append($("<img id=imgauto>").click(function() {
    setthumb.set($("#imgauto", setthumb).attr("src"));
  }))
  .append($("<img id=imglogo>").click(function() {
    bg.sizeImage($("#imglogo", setthumb).attr("src"), 300, function(image) {
//$("body").append($("<div>").text(image));
      setthumb.set(image);
    });
  }))
  .append("<div class=clear>")
  .append($("<div class=subtitle>").text("Custom Image"))
  .append($("<input type=text id=imgurl>").attr("placeholder","http://some/image.png"))
  .append($("<input type=button id=save>").val("Set Custom Image (URL)").click(function() {
//$("body").append($("<div>").text($("#imgurl", setthumb).val()));
    bg.sizeImage($("#imgurl", setthumb).val(), 300, function(image) {
$("body").append($("<div>").text(image));
      setthumb.set(image);
    });
  }))
  .append("<div class=clear>"))
setthumb.item = null;
setthumb.show = function(item) {
  setthumb.item = item;
  setthumb.css({"display":"block","opacity":"0"}).animate({"opacity":1}, 200);
  $(".page", setthumb).animate({"height":"hide"},0).animate({"height":"show"}, 200);
  $("#editurl", setthumb).val(item.url);
  setthumb.imgauto = $("img",item.elem).attr("src");
  if(setthumb.imgauto != "thumb.png") $("#imgauto", setthumb).attr("src", setthumb.imgauto).css({"display":"block"});
  else $("#imgauto", setthumb).attr("src", "").css({"display":"none"});
  setthumb.imglogo = bg.getLogo(item.url);
  if(setthumb.imglogo) $("#imglogo", setthumb).attr("src", setthumb.imglogo).css({"display":"block"});
  else $("#imglogo", setthumb).attr("src", "").css({"display":"none"});
  if(setthumb.imgauto != "thumb.png" || setthumb.imglogo) $("#imgsubtitle", setthumb).css({"display":"block"});
  else $("#imgsubtitle", setthumb).css({"display":"none"});
  $("#imgurl", setthumb).val("");
//  if(item.imginfo && item.imginfo.thumbstoreid) $("#imgurl", setthumb).val(item.imginfo.thumbstoreid);
}
setthumb.set = function(image) {
  setthumb.animate({"opacity":0}, 200, function() { $(this).css({"display":"none"}) });
  bg.setThumbstore($("#editurl", setthumb).val(), image, function() {
    delete views[setthumb.item.view.type];
    setthumb.item.view.node.remove();
    showView(setthumb.item.view.type);
  });
}
setthumb.unset = function(item) {
  if(!item.imginfo || !item.imginfo.thumbstoreid) return;
  bg.removeThumbstore(item.imginfo.thumbstoreid, function() {
    delete views[item.view.type];
    item.view.node.remove();
    showView(item.view.type);
  });
}

var doLoadTheme = function(arg) {
  var loadstr = "Loading Theme";
  var loading = $("<div>")
    .css({"position":"fixed","left":"0","top":"0","width":"100%","height":"100%","background-color":"rgba(128,128,128,.5)","opacity":"0","z-index":"999999999999"})
    .appendTo("body")
    .append($("<div>").text(loadstr+"...")
      .css({"display":"table","margin":"20% auto 0","padding":".5em","color":"#fff","background-color":"#555", "border-radius":".5em","font-size":"2em"}))
    .animate({"opacity":1}, 200)
  $("div", loading).css({"width":$("div", loading).width(), "display":"block"});
  var n = 3;
  var timer = setInterval(function() {
    n = n%3+1;
    var str = loadstr;
    for(i=0; i<n; i++) str+=".";
    $("div", loading).text(str);
  }, 500);
  bg.loadTheme(arg, function() {
    loadstr = "Loading Background";
    $("div", loading).text(loadstr+"...").css({"width":"", "display":"table"});
    $("div", loading).css({"width":$("div", loading).width(), "display":"block"});
  }, function() {
    refreshTheme();
    loading.animate({"opacity":0}, 200, function() {
      clearInterval(timer);
      loading.remove();
    });
  });
}

var options = $("<div id=options class=popover>").appendTo("body").append($("<div class=page>")
  .append($("<div class=close>").text("close").click(function() {
    options.animate({"opacity":0}, 200, function() { $(this).css({"display":"none"}) });
  }))
  .append($("<div class=title>").text("Options")));

$(".page",options)
  .append($("<div class=subtitle>").text("Import Custom Theme"))
  .append($("<div class=descrip>").text("Download the .crx file for the theme of your choice or provide a URL. The background and colors of the theme will be loaded into this new tab page."))

if(window.FileReader)
$(".page",options)
  .append($("<div class=filespoof id=import>")
    .append($("<input type=file>").change(function() {
      var finput = this;
      if(this.files.length <= 0) return;
      var ext = $(finput).val().substr($(finput).val().lastIndexOf(".")+1);
      if(ext != "zip" && ext != "crx") return;
      var reader = new FileReader();
      reader.onload = function(e) {
        finput.value = "";
        options.animate({"opacity":0}, 200, function() { $(this).css({"display":"none"}) });
        doLoadTheme({binaryString:reader.result});
      }
      reader.readAsBinaryString(this.files[0]);
    })).append($("<input type=button>").attr("tabindex",-1).val("Load Theme from hard drive (.crx)")))
  .append("<div class=clear style='text-align:center;color:#CCC;font-size:.8em;'>or</div>")

$(".page",options)
  .append($("<input type=text id=download>").attr("placeholder","Load Theme URL").keyup(function(t) {
    var url = null;
    var match = $(this).val().match(/([^a-p]|^)([a-p]{32})([^a-p]|$)/);
    if(match && match[2]) url = "https://clients2.google.com/service/update2/crx?response=redirect&x=uc%26id%3D"+match[2];
    if($(this).val().match(/\.crx$|google.com\/.+\/crx/)) url = $(this).val();
    if(!url) return;
    $(this).val("");
    options.animate({"opacity":0}, 200, function() { $(this).css({"display":"none"}) });
    doLoadTheme({url:url});
  }))
  .append("<div class=clear style='height:.3em'>")
  .append($("<div class='themelink'>").css({"margin-right":"1.5em"}).append($("<a class=theme>").text("Blank").click(function() {
    bg.clearTheme();
    refreshTheme();
    options.animate({"opacity":0}, 200, function() { $(this).css({"display":"none"}) });
  })))

var themes = {
  "Space":        "hdmjogfllcoajjflloeiaoaplmohkcdf",
  "Cloud":        "bjgddfhochneogcjblfijidkjjceolgb",
  "Voyage":       "ddgmdidminnkiajaonminefjlllglgap",
  "Robot":        "oeljdmeofcikjblcoehpmdnooimalbmj",
  "Rain Drops":   "fibbldnbbceipdbllefcjaocmochkegg",
  "R2D2":         "ahcijhhojfefnmpagabibhpkgjgmdlgp",
  "Wood":         "mhepbfioblgelmnboacpblnkpiafcgki",
  "Hedgehog Fog": {"site":"https://tools.google.com/chrome/intl/en/themes/theme_at_hedgehoginthefog.html",
                   "crx":"https://dl-ssl.google.com/chrome/extensions/at_hedgehoginthefog_v2.crx"},
  "Mesh":         {"site":"https://tools.google.com/chrome/intl/en/themes/theme_at_karimrashid.html",
                   "crx":"https://dl-ssl.google.com/chrome/extensions/at_karimrashidv3.crx"},
  "Dark Colors":  {"site":"https://tools.google.com/chrome/intl/en/themes/theme_at_jameswhite.html",
                   "crx":"https://dl-ssl.google.com/chrome/extensions/at_jameswhite.crx"},
  "Porche":       {"site":"https://tools.google.com/chrome/intl/en/themes/theme_at_porsche.html",
                   "crx":"https://dl-ssl.google.com/chrome/extensions/at_porsche.crx"},
  "Cork":         {"site":"https://tools.google.com/chrome/intl/en/themes/theme_corkboard.html",
                   "crx":"https://dl-ssl.google.com/chrome/extensions/CorkBoard.crx"}
}
$.each(themes, function(title, links) {
  if(typeof links == "string")
    links = {"site":"https://chrome.google.com/webstore/detail/"+links,
             "crx":"https://clients2.google.com/service/update2/crx?response=redirect&x=uc%26id%3D"+links}
  $(".page",options).append($("<div class=themelink>").append($("<a class=theme>").text(title).click(function() {
    doLoadTheme({url:links.crx});
    options.animate({"opacity":0}, 200, function() { $(this).css({"display":"none"}) });
  })).append("<a class=extsite href='"+links.site+"' target='_blank'>&#x2197;</a>"))
});

$(".page",options)
  .append("<div class=clear>")

$(".page",options)
  .append($("<div class=subtitle>").text("Load Custom Background"))
  .append($("<div class=descrip>").text("Choose the image file from your computer or provide a URL."))

if(window.FileReader)
$(".page",options)
  .append($("<div class=filespoof id=import>")
    .append($("<input type=file>").change(function() {
      var finput = this;
      if(this.files.length <= 0) return;
      var ext = $(finput).val().substr($(finput).val().lastIndexOf(".")+1);
//      if(ext != "png" && ext != "jpg" && ext != "jpeg" && ext != "gif") return;
      var reader = new FileReader();
      reader.onload = function(e) {
        finput.value = "";
        options.animate({"opacity":0}, 200, function() { $(this).css({"display":"none"}) });
        bg.theme.bgImage = reader.result;
        bg.theme.bgSize = "100%";
        bg.theme.bgAlign = "top left";
        bg.storeTheme();
        refreshTheme();
      }
      reader.readAsDataURL(this.files[0]);
    })).append($("<input type=button>").attr("tabindex",-1).val("Load Image from hard drive")))
  .append("<div class=clear>")

$(".page",options)
  .append($("<div class=subtitle>").text("Automatically Update Images"))
  .append($("<select>").css({"float":"right"})
    .append($("<option>").text("On").val(1))
    .append($("<option>").text("Off").val(0))
    .val(bg.ls("updatethumbs")?1:0)
    .change(function() {
      bg.ls("updatethumbs", $(this).val()==1);
    }))
  .append($("<div class=descrip>").text("Disable this feature if it makes your computer too slow."))

options.show = function() {
  options.css({"display":"block","opacity":"0"}).animate({"opacity":1}, 200);
  $(".page", options).animate({"height":"hide"},0).animate({"height":"show"}, 200);
}

$("body").append($("<a id=optionsbutton>").text("Options").click(function() {
  options.show();
}))


var contextmenu = $("<div id=contextmenu>").appendTo("body")

var layoutbar = $("<div id=layoutbar class=togglerow>").appendTo("body")
var toggles = {};
toggles['gridindex'] = $("<a id=gridindexlayout class=layout>")
  .attr("selected",ls(ls('view')+'-layout')=="grid" && ls(ls('view')+'-sort')=="index")
  .click(function() {
    if(ls(ls('view')+'-layout')=="grid" && ls(ls('view')+'-sort')=="index") return;
    ls(ls('view')+'-layout', 'grid');
    ls(ls('view')+'-sort', 'index');
    views[ls('view')].setLayout("grid");
    views[ls('view')].sort("index");
    views[ls('view')].layoutUpdate();
    for(layout in toggles) toggles[layout].attr("selected",layout=='gridindex')
  })
  .append("<img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAOCAYAAAAi2ky3AAAAAXNSR0IArs4c6QAAAAZiS0dEAIgAiACIdJABBgAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9oHCxU2AImhPhYAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAKUlEQVQoz2Ps6Oj4z4AHVFRUMDIwMDAQUsfEQCUwatBQBIyj6WgIGgQAfR4NRWplEr0AAAAASUVORK5CYII='>")
  .appendTo(['apps', 'tabs', 'speeddial'].indexOf(ls('view'))!=-1?layoutbar:"body")
toggles['gridtime'] = $("<a id=gridtimelayout class=layout>")
  .attr("selected",ls(ls('view')+'-layout')=="grid" && ls(ls('view')+'-sort')=="time")
  .click(function() {
    if(ls(ls('view')+'-layout')=="grid" && ls(ls('view')+'-sort')=="time") return;
    ls(ls('view')+'-layout', 'grid');
    ls(ls('view')+'-sort', 'time');
    views[ls('view')].setLayout("grid");
    views[ls('view')].sort("time");
    views[ls('view')].layoutUpdate();
    for(layout in toggles) toggles[layout].attr("selected",layout=='gridtime')
  })
  .append("<img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAOCAYAAAAi2ky3AAAAAXNSR0IArs4c6QAAAAZiS0dEAIgAiACIdJABBgAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9oHCxU2AImhPhYAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAKUlEQVQoz2Ps6Oj4z4AHVFRUMDIwMDAQUsfEQCUwatBQBIyj6WgIGgQAfR4NRWplEr0AAAAASUVORK5CYII='>")
  .appendTo(['bookmarks', 'history'].indexOf(ls('view'))!=-1?layoutbar:"body")
toggles['listindex'] = $("<a id=listindexlayout class=layout>")
  .attr("selected",ls(ls('view')+'-layout')=="list" && ls(ls('view')+'-sort')=="index")
  .click(function() {
    if(ls(ls('view')+'-layout')=="list" && ls(ls('view')+'-sort')=="index") return;
    ls(ls('view')+'-layout', 'list');
    ls(ls('view')+'-sort', 'index');
    views[ls('view')].setLayout("list");
    views[ls('view')].sort("index");
    views[ls('view')].layoutUpdate();
    for(layout in toggles) toggles[layout].attr("selected",layout=='listindex')
  })
  .append("<img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAOCAYAAAAi2ky3AAAAAXNSR0IArs4c6QAAAAZiS0dEAMYAxgDGeDMrcwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9oHCxU5GB1Vuo8AAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAIUlEQVQoz2Ps6Oj4z0AFwMRAJUA1gwYfYBwN7NHAHkwAAAGYB9Woux9IAAAAAElFTkSuQmCC'>")
  .appendTo(['apps', 'tabs'].indexOf(ls('view'))!=-1?layoutbar:"body")
toggles['listtime'] = $("<a id=listtimelayout class=layout>")
  .attr("selected",ls(ls('view')+'-layout')=="list" && ls(ls('view')+'-sort')=="time")
  .click(function() {
    if(ls(ls('view')+'-layout')=="list" && ls(ls('view')+'-sort')=="time") return;
    ls(ls('view')+'-layout', 'list');
    ls(ls('view')+'-sort', 'time');
    views[ls('view')].setLayout("list");
    views[ls('view')].sort("time");
    views[ls('view')].layoutUpdate();
    for(layout in toggles) toggles[layout].attr("selected",layout=='listtime')
  })
  .append("<img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAOCAYAAAAi2ky3AAAAAXNSR0IArs4c6QAAAAZiS0dEAMYAxgDGeDMrcwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9oHCxU5GB1Vuo8AAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAIUlEQVQoz2Ps6Oj4z0AFwMRAJUA1gwYfYBwN7NHAHkwAAAGYB9Woux9IAAAAAElFTkSuQmCC'>")
  .appendTo(['bookmarks', 'history'].indexOf(ls('view'))!=-1?layoutbar:"body")
toggles['tree'] = $("<a id=treelayout class=layout>")
  .attr("selected",ls(ls('view')+'-layout')=="tree")
  .click(function() {
    if(ls(ls('view')+'-layout')=="tree") return;
    ls(ls('view')+'-layout', 'tree');
    views[ls('view')].setLayout("tree");
    views[ls('view')].layoutUpdate();
    for(layout in toggles) toggles[layout].attr("selected",layout=='tree')
  })
  .append("<img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAOCAYAAAAi2ky3AAAAAXNSR0IArs4c6QAAAAZiS0dEAMYAxgDGeDMrcwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9oHCxU5GB1Vuo8AAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAIUlEQVQoz2Ps6Oj4z0AFwMRAJUA1gwYfYBwN7NHAHkwAAAGYB9Woux9IAAAAAElFTkSuQmCC'>")
  .appendTo([].indexOf(ls('view'))!=-1?layoutbar:"body")

var viewtypes = {'apps':'Apps', 'tabs':'Tabs', 'bookmarks':'Bookmarks', 'history':'History', 'speeddial':'Speeddial'};

var titlebar = $("<ul id=titlebar>").appendTo("body");
for(type in viewtypes)
  titlebar.append($("<li>").attr("id",type+"title").text(viewtypes[type]).attr("selected",ls('view') == type).click(function(type){return function() {
    if(ls('view') == type) return;
    $("#"+ls('view')+"view").animate({"opacity":0}, 200, function() { $(this).css({"display":"none"}); });
    ls('view', type);
    showView(type);
    $("#titlebar li").attr("selected",false);
    $(this).attr("selected",true);

    for(layout in toggles) toggles[layout].attr("selected",!!layout.match(new RegExp(ls(ls('view')+'-layout'))) && !!layout.match(new RegExp(ls(ls('view')+'-sort')))).appendTo("body");
    if(['apps', 'tabs', 'speeddial'].indexOf(ls('view'))!=-1) toggles['gridindex'].appendTo(layoutbar);
    if(['bookmarks', 'history'].indexOf(ls('view'))!=-1) toggles['gridtime'].appendTo(layoutbar);
    if(['apps', 'tabs'].indexOf(ls('view'))!=-1) toggles['listindex'].appendTo(layoutbar);
    if(['bookmarks', 'history'].indexOf(ls('view'))!=-1) toggles['listtime'].appendTo(layoutbar);
    if([].indexOf(ls('view'))!=-1) toggles['tree'].appendTo(layoutbar);
  }}(type)))


var tabId = null;
var winId = null;
var views = {};

chrome.extension.sendRequest({getself:true}, function(resp) {
  tabId = resp.tab.id;
  winId = resp.tab.windowId;

  Item.width = 250;
  Item.border = 4;
  Item.imgWidth = Item.width-Item.border*2;
  var ratio = window.innerHeight/window.innerWidth;
  Item.imgHeight = Math.round((ratio>.5?ratio:.5)*Item.imgWidth*.95);
  Item.height = Item.imgHeight+Item.border*2+20;
  showView(ls('view'));
});

var showView = function(type) {
  if(views[type]) {
    views[type].layoutUpdate();
  } else {
    views[type] = new View(type, ls(type+'-layout'));
    views[type].populate(function() {
      views[type].sort(ls(type+'-sort'));
      views[type].layoutUpdate();
    });
  }
}

var View = function(type, layout) {
  this.type = type;
  this.node = $("<div>").attr("id", type+"view").css({"display":"none"}).appendTo("body");
  this.footer = $("<div>").attr("class", "footer").appendTo(this.node);
  if(type=="history") this.footer.append($("<a href='chrome://history'>").text("more history").click(function(){ chrome.tabs.update(tabId, {"url":"chrome://history"}); return false; }));
  if(type=="bookmarks") this.footer.append($("<a href='chrome://bookmarks'>").text("more bookmarks").click(function(){ chrome.tabs.update(tabId, {"url":"chrome://bookmarks"}); return false; }));
  this.setLayout(layout);
}
View.prototype.populate = function(callback) {
  var view = this;
  Item.getAll(this.type, function(items) {
    view.items = items;
    for(var i=0; i<items.length; i++) {
      items[i].view = view;
      view.node.append(items[i].elem);
      view.node.append(items[i].note);
    }
    callback();
  });
}
View.prototype.sort = function(type) {
  if(!this.items) return;
  if(type == "domain") this.items.sort(function(a,b) {
    var a = (a.url.match(/:\/\/([^\/]*)\//)[1]||"").replace(/[^a-zA-Z.]*/,"").toLowerCase();
    var b = (b.url.match(/:\/\/([^\/]*)\//)[1]||"").toLowerCase();
    return a < b ? -1 : (a == b ? 0 : 1); 
  }); else
  if(type == "title") this.items.sort(function(a,b) {
    var a = a.title.replace(/[^a-zA-Z ]*/,"").toLowerCase();
    var b = b.title.replace(/[^a-zA-Z ]*/,"").toLowerCase();
    return a < b ? -1 : (a == b ? 0 : 1); 
  }); else
  if(type == "index") this.items.sort(function(a,b) {
    if(a.index == undefined) return -1;
    return a.index < b.index ? -1 : (a.index == b.index ? 0 : 1);
  });
  if(type == "time") this.items.sort(function(a,b) {
    if(a.time == undefined) return -1;
    return a.time > b.time ? -1 : (a.time == b.time ? 0 : 1);
  });
}
View.prototype.setLayout = function(type) {
  this.layoutUpdate = this.layout[type].update;
  this.layoutIndex = this.layout[type].index;
}
View.prototype.layout = {};
View.prototype.layout.grid = {};
View.prototype.layout.grid.update = function() {
  var animate = 300;
  if(!this.items) return;
  for(var i=0; i<this.items.length; i++)
    this.items[i].draggable = ls(this.type+"-sort")=="index";

  var display = this.node.css("display") != "none"
  if(!display) this.node.css({"display":"block", "opacity":"0"}).animate({"opacity":1}, animate>0?animate:0);

  $(".item:not([showthumb=true]) .thumbborder", this.node).animate({height:'show', opacity:1}, animate>0?animate:0);
  $(".item", this.node).attr("showthumb","true");

  var cols = Math.round(Math.sqrt(this.items.length)+1);
  var width = Item.width*cols+40*(cols-1);
  var zoom = window.innerWidth/width*.8;
  zoom = zoom < 1 ? zoom : 1;
  this.layoutLeft = Math.floor((window.innerWidth-width*zoom)/2);
  this.layoutTop = 120;
  if(titlebar.css("display") != "none") titlebar.animate({"left":this.layoutLeft}, {duration:animate?animate:0, queue:false});
  else titlebar.css({"display":"block", "left":this.layoutLeft});
  for(var i=0; i<this.items.length; i++) {
    if(this.items[i].dragging) continue;
    var left = Math.floor(this.layoutLeft + (i%cols)*(Item.width*1.2)*zoom);
    var top =  Math.floor(this.layoutTop + Math.floor(i/cols)*(Item.height*1.2)*zoom);
    this.items[i].elem.css({"width":this.items[i].elem.width(), "display":"block"});
    $(".thumbborder", this.items[i].elem).css({"zoom":zoom});
    this.items[i].elem.animate({"width":Item.width*zoom, "left":left, "top":top}, {duration:animate>0&&display?animate:0, queue:false});
//    this.items[i].elem.css({"width":Item.width*zoom, "left":left, "top":top});
    this.items[i].note.css({"display":"none"});
  }
  this.layoutCols = cols;
  this.layoutWidth = width;
  this.layoutZoom = zoom;
  this.footer.css({"display":"block", "left":Math.floor(this.layoutLeft), "top":10+this.layoutTop + Math.ceil(this.items.length/cols)*(Item.height*1.2)*zoom});
}
View.prototype.layout.grid.index = function(point) {
  for(var c=0; c<this.layoutCols-1; c++)
    if(point.x < this.layoutLeft + (c+.5)*(Item.width*1.2)*this.layoutZoom) break;
  for(var r=0; r<Math.ceil(this.items.length/this.layoutCols)-1; r++)
    if(point.y < this.layoutTop + (r+.5)*(Item.height*1.2)*this.layoutZoom) break;
  return c+r*this.layoutCols < this.items.length ? c+r*this.layoutCols : this.items.length-1;
}
View.prototype.layout.list = {};
View.prototype.layout.list.update = function() {
  var _this = this;
  var animate = 300;
  if(!this.items) return;
  for(var i=0; i<this.items.length; i++)
    this.items[i].draggable = ls(this.type+"-sort")=="index";

  var display = this.node.css("display") != "none"
  if(!display) this.node.css({"display":"block", "opacity":"0"}).animate({"opacity":1}, animate>0?animate:0);

  $(".item:not([showthumb=false])", this.node)
    .each(function() {
      if(_this.items.length > 36) {
        $(".thumbborder", this).css({"display":'none'});
        $(this).css({"width":"auto", "display":"table"});
      } else {
        $(".thumbborder", this).animate({height:'hide', opacity:0}, animate>0&&display?animate:0, function() {
          $(this).animate({height:'show', opacity:1}, 0).css({display:'none'});
        });
        $(this).animate({"width":$(".title",this).width()+27}, animate>0&&display?animate:0, function() {
          $(this).css({"width":"auto", "display":"table"});
        });
      }
    })
    .attr("showthumb","false")

  this.layoutLeft = Math.floor(Math.max((window.innerWidth-650)/2,10));
  this.layoutTop = 120;
  if(titlebar.css("display") != "none") titlebar.animate({"left":this.layoutLeft}, {duration:animate?animate:0, queue:false});
  else titlebar.css({"display":"block", "left":this.layoutLeft});
  var lastdate = null;
  for(var i=0; i<this.items.length; i++) {
    if(this.items[i].dragging) continue;
    var left = Math.floor(this.layoutLeft);
    var top =  Math.floor(this.layoutTop + i*($(".info",this.items[i].elem).height()+4));
    this.items[i].elem.children().css({"zoom":1});
    if(this.items.length > 36) {
      this.items[i].elem.css({"left":left, "top":top});
    } else {
      this.items[i].elem.animate({"left":left, "top":top}, {duration:animate>0&&display?animate:0, queue:false});
    }
    if(ls(ls('view')+'-sort')=='time') {
      var date = new Date(this.items[i].time);
      var note = "";
      if(new Date().getTime() - new Date(this.items[this.items.length-1].time).getTime() < 1000*60*60) {
        if(!lastdate || Math.floor(lastdate.getTime()/1000/60/5) != Math.floor(date.getTime()/1000/60/5))
          note = ((date.getHours()+11)%12+1)+":"+(date.getMinutes()<10?"0":"")+(Math.floor(date.getMinutes()/5)*5)+(date.getHours()>11?"p":"a");
      } else if(new Date().getTime() - new Date(this.items[this.items.length-1].time).getTime() < 1000*60*60*24) {
        if(!lastdate || Math.floor(lastdate.getTime()/1000/60/60) != Math.floor(date.getTime()/1000/60/60))
          note = ((date.getHours()+11)%12+1)+":00"+(date.getHours()>11?"p":"a");
      } else {
        if(!lastdate || Math.floor(lastdate.getTime()/1000/60/60/24) != Math.floor(date.getTime()/1000/60/60/24))
          note = date.toDateString();
        if(note == new Date().toDateString())
          note = "Today";
        if(new Date().getTime() - new Date(this.items[this.items.length-1].time).getTime() < 1000*60*60*24*365)
          note = note.replace(/ [0-9]{4}/,"");
      }
      lastdate = date;
      this.items[i].note.text(note).css({"display":"", "left":left-this.items[i].note.width()-10, "top":top+2});
    } else
      this.items[i].note.css({"display":"none"});
  }
  this.footer.css({"display":"block", "left":Math.floor(this.layoutLeft), "top":10+Math.floor(this.layoutTop + this.items.length*(this.items[0]?$(".info",this.items[0].elem).height()+4:0))});
}
View.prototype.layout.list.index = function(point) {
  for(var i=0; i<this.items.length-1; i++)
    if(point.y < this.layoutTop + (i+.5)*($(".info",this.items[i].elem).height()+4)) break;
  return i;
}
View.prototype.layout.tree = {};
View.prototype.layout.tree.update = function() {
  var _this = this;
  var animate = 300;
  if(!this.items) return;
  for(var i=0; i<this.items.length; i++)
    this.items[i].draggable = ls(this.type+"-sort")=="index";

  var display = this.node.css("display") != "none"
  if(!display) this.node.css({"display":"block", "opacity":"0"}).animate({"opacity":1}, animate>0?animate:0);

  $(".item:not([showthumb=false])", this.node)
    .each(function() {
      if(_this.items.length > 36) {
        $(".thumbborder", this).css({height:'hide', opacity:0});
        $(this).css({"width":"auto", "display":"table"});
      } else {
        $(".thumbborder", this).animate({height:'hide', opacity:0}, animate>0&&display?animate:0);
        $(this).animate({"width":$(".title",this).width()+27}, animate>0&&display?animate:0, function() {
          $(this).css({"width":"auto", "display":"table"});
        });
      }
    })
    .attr("showthumb","false")

  this.layoutLeft = Math.floor(Math.max((window.innerWidth-650)/2,10));
  this.layoutTop = 120;
  if(titlebar.css("display") != "none") titlebar.animate({"left":this.layoutLeft}, {duration:animate?animate:0, queue:false});
  else titlebar.css({"display":"block", "left":this.layoutLeft});
  var lastdate = null;
  for(var i=0; i<this.items.length; i++) {
    if(this.items[i].dragging) continue;
    var left = Math.floor(this.layoutLeft);
    var top =  Math.floor(this.layoutTop + i*($(".info",this.items[i].elem).height()+4));
    this.items[i].elem.children().css({"zoom":1});
    if(this.items.length > 36) {
      this.items[i].elem.css({"left":left, "top":top});
    } else {
      this.items[i].elem.animate({"left":left, "top":top}, {duration:animate>0&&display?animate:0, queue:false});
    }
    this.items[i].note.css({"display":"none"});
  }
}
View.prototype.layout.tree.index = function(point) {
  for(var i=0; i<this.items.length-1; i++)
    if(point.y < this.layoutTop + (i+.5)*($(".info",this.items[i].elem).height()+4)) break;
  return i;
}

var Item = function(title, url, properties, click, swapped) {
  var item = this;
  item.id = Math.floor(Math.random()*100000000);
  item.title = title;
  item.url = url;
  for(p in properties)
    item[p] = properties[p];
  item.click = function(t) { click(item, t) };
  item.swapped = swapped ? function(item2) { swapped(item,item2) } : function(){};

  var img = $("<img class=thumb>").width(Item.imgWidth);
  var updateImage = function() {
    bg.getImage(item, function(image, info) {
      item.imginfo = info;
      img.load(function() {
        if(item.imginfo.icon) {
          var size = Math.min(Item.imgHeight, 128);
          img.width(size).css({"top":(Item.imgHeight-size)/2, "left":(Item.imgWidth-size)/2});
        } else if(item.imginfo.favicon) {
          var size = Math.min(Item.imgHeight, 64);
          img.width(size).css({"top":(Item.imgHeight-size)/2, "left":(Item.imgWidth-size)/2});
        } else {
          var top = (Item.imgHeight-img[0].height/img[0].width*Item.imgWidth)/2;
          img.css({"top":top>0||top<-25?top:0});
        }
      })
      if(image) img.attr("src",image).css({"opacity":"1"});
    });
  }
  updateImage();

  item.note = $("<div class=itemnote>");
  item.elem = $("<a class=item>").attr("id","item-"+item.id).attr("title",item.title).css({"width":Item.width+"px"})
    .append($("<div class=thumbborder>").css({"width":Item.imgWidth+"px", "height":Item.imgHeight+"px", "border-width":(Item.border-1)+"px", "padding":"1px 1px 0 1px"})
      .append($("<div class=contextbutton>").mousedown(function(t){t.stopPropagation()}).click(function(t) {
        t.stopPropagation();
        t.preventDefault();
        item.elem.trigger('contextmenu', [t]);
      }))
      .append($("<div class=thumbgradient>").css({"width":(Item.imgWidth+2)+"px", "height":Item.imgHeight+"px", "margin-left":"-1px"}))
      .append(img))
    .append($("<div class=info>")
      .append($("<img class=favicon>").attr("src", item.icon?item.icon:"chrome://favicon/"+item.url))
      .append($("<span class=title>").text(item.title)))

  if(!item.tabid) item.elem.attr("href",item.url);

  item.elem.click(function(t) {
    t.stopPropagation();
    t.preventDefault();
  });
  item.elem.mousedown(function(t) {
    if(t.button != 0) return;
    t.stopPropagation();
    t.preventDefault();
    if(!item.view) return;
    if(!item.draggable) return;
    item.dragging = false;
    item.mouse = {x: t.clientX, y: t.clientY};
    item.index = item.view.items.indexOf(item);
    item.newIndex = item.index;
    item.elem.css({"z-index":"1001"});
    $(window).bind("mousemove", mousemove);
    $(window).bind("mouseup", mouseup);
  });
  var mousemove = function(t) {
    var x = t.clientX-item.mouse.x; var y = t.clientY-item.mouse.y;
    if(!item.dragging && (Math.abs(x) > 5 || Math.abs(y) > 5))
      item.dragging = {
        x: parseInt(item.elem.css("left")),
        y: parseInt(item.elem.css("top")),
        placeholder: $("<div class=placeholder>").css({"position":"absolute","width":item.elem.width()+2,"height":item.elem.height()+2,"left":parseInt(item.elem.css("left"))-2,"top":parseInt(item.elem.css("top"))-2,"z-index":"-1","border":"1px dashed #888","border-radius":"5px"}).appendTo("body")
      }
    if(!item.dragging) return;
    item.elem.css({"left":item.dragging.x+x, "top":item.dragging.y+y});
    var i = item.view.layoutIndex({x:item.dragging.x+x, y:item.dragging.y+y});
    if(i != item.newIndex) {
      item.swapTo(item.index);
      if(i != null) {
        item.swapTo(i);
        item.newIndex = i;
      }
      if(item.view) item.view.layoutUpdate(200);
    }
  }
  var mouseup = function(t) {
    if(!item.draggable) return;
    if(!item.dragging) item.click(t);
    else {
      item.dragging.placeholder.animate({"opacity":0}, 200, function() {
        $(item).remove();
      });
      item.dragging = false;
      item.swapped(item.view.items[item.index]);
    }
    item.elem.css({"z-index":"1"});
    $(window).unbind("mousemove", mousemove);
    $(window).unbind("mouseup", mouseup);
    if(item.view) item.view.layoutUpdate(200);
  }

  item.elem.click(function(t) {
    if(!item.draggable || t.button != 0) item.click(t);
  });
  item.elem.bind("contextmenu", function(t, trigger) {
    t.preventDefault();
    contextmenu.empty();
    if(item.extid) {
      contextmenu.append($("<div class=contextbutton>").text("Open in Pinned Tab").click(function() { close();
        chrome.tabs.create({url:item.url, pinned:true}, function() {
          chrome.tabs.remove(tabId);
        });
      }));
    }
    if(!item.tabid) {
      contextmenu.append($("<div class=contextbutton>").text("Open in New Tab").click(function() { close();
        chrome.tabs.create({url:item.url});
      }));
      contextmenu.append($("<div class=contextbutton>").text("Open in New Window").click(function() { close();
        chrome.windows.create({url:item.url});
      }));
    }
    if(item.extid) {
      contextmenu.append("<div class=sep>");
      contextmenu.append($("<div class=contextbutton>").text("Uninstall").click(function() { close();
        chrome.management.uninstall(item.extid);
        item.view.items.splice(item.view.items.indexOf(item), 1);
        item.view.layoutUpdate();
        item.elem.remove();
        item.note.remove();
      }));
    }
    if(item.view.type != "speeddial") {
      contextmenu.append("<div class=sep>");
      contextmenu.append($("<div class=contextbutton>").text("Add to Speeddial").click(function() { close();
        chrome.bookmarks.create({parentId:"1", title:item.title, url:item.url}, function() {
          views["speeddial"].node.remove();
          delete views["speeddial"];
          $("#speeddialtitle").click();
        });
      }));
    }
    if(ls(item.view.type+"-layout")=="grid") {
      contextmenu.append("<div class=sep>");
      if(item.imginfo && item.imginfo.thumbstoreid) {
        contextmenu.append($("<div class=contextbutton>").text("Unpin Thumbnail").click(function() { close();
          setthumb.unset(item);
        }));
      } else {
        contextmenu.append($("<div class=contextbutton>").text("Choose Thumbnail").click(function() { close();
          setthumb.show(item);
        }));
        if(item.imginfo && item.imginfo.thumbsid) {
          contextmenu.append($("<div class=contextbutton>").text("Delete Thumbnail").click(function() { close();
            if(bg.db) bg.db.transaction(function(tx) {
              tx.executeSql("DELETE FROM thumbs WHERE id = ?", [item.imginfo.thumbsid]);
              item.imginfo = {};
            });
            updateImage();
          }));
        }
      }
    }
    if(item.bmkid) {
      contextmenu.append("<div class=sep>");
      contextmenu.append($("<div class=contextbutton>").text("Edit Bookmark").click(function() { close();
        editbookmark.show(item);
      }));
      if(item.view.type == "speeddial") {
        contextmenu.append($("<div class=contextbutton>").text("Archive").click(function() { close();
          chrome.bookmarks.getTree(function(tree) {
            var other = tree[0].children[1];
            chrome.bookmarks.move(item.bmkid, {parentId:other.id});
          });
          item.view.items.splice(item.view.items.indexOf(item), 1);
          item.view.layoutUpdate();
          item.elem.remove();
          item.note.remove();
        }));
      }
      contextmenu.append($("<div class=contextbutton>").text("Delete").click(function() { close();
        if(!confirm("Are you sure that you want to delete this bookmark?")) return;
        chrome.bookmarks.remove(item.bmkid);
        item.view.items.splice(item.view.items.indexOf(item), 1);
        item.view.layoutUpdate();
        item.elem.remove();
        item.note.remove();
      }));
    }
    if(item.histid) {
      contextmenu.append("<div class=sep>");
      contextmenu.append($("<div class=contextbutton>").text("Delete").click(function() { close();
        chrome.history.deleteUrl({url:item.url});
        item.view.items.splice(item.view.items.indexOf(item), 1);
        item.view.layoutUpdate();
        item.elem.remove();
        item.note.remove();
      }));
    }
    contextmenu.css({"left":t.clientX?t.clientX-1:trigger.clientX-50, "top":t.clientY?t.clientY-4:trigger.clientY-4, "display":"block"});
    var shield = $("<div>").css({"position":"fixed","left":0,"top":0,"width":"100%","height":"100%","z-index":"9999"}).appendTo("body");
    var close = function() {
      shield.remove();
      contextmenu.css({"display":"none"});
    }
    shield.mousedown(close);
  });
}
Item.prototype.moveTo = function(to) {
  if(!this.view) return;
  this.view.items.splice(this.view.items.indexOf(this), 1);
  this.view.items.splice(to, 0, this);
}
Item.prototype.swapTo = function(to) {
  if(!this.view) return;
  var from = this.view.items.indexOf(this);
  var tmp = this.view.items[from]; this.view.items[from] = this.view.items[to]; this.view.items[to] = tmp;
}


Item.getAll = function(type, callback) {
  if(type == 'apps') {
    var items = [];
    chrome.management.getAll(function(exts) {
      exts.unshift({id:"webstore", name:"Chrome Webstore", appLaunchUrl:"https://chrome.google.com/webstore", icons:[{size:128,url:"data:image/png;base64,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"}], isApp:true});
      var appindex = ls('appindex');
      for(var i=0; i<exts.length; i++) {
        var ext = exts[i];
        if(!ext.isApp) continue;
        if(appindex.indexOf(ext.id) < 0)
          appindex.unshift(ext.id); 
      }
      ls('appindex', appindex);
      for(var i=0; i<exts.length; i++) {
        var ext = exts[i];
        if(!ext.isApp) continue;
        var icon = undefined;
        for(var j=0; ext.icons && j<ext.icons.length; j++) if(ext.icons[j].size==128) icon = ext.icons[j].url;
        items.push(new Item(ext.name, ext.appLaunchUrl, {
          extid: ext.id,
          icon: icon,
          index: appindex.indexOf(ext.id)
        },function(item, t){
          if(t.button == 0)
            chrome.tabs.update(tabId, {url:item.url});
          else if(t.button == 1)
            chrome.tabs.create({url:item.url});
        },function(item1,item2){
          var i1 = item1.view.items.indexOf(item1);
          var i2 = item2.view.items.indexOf(item2);
          item1.index = i1;
          item2.index = i2;
          appindex[i1] = item1.extid;
          appindex[i2] = item2.extid;
          ls('appindex', appindex);
        }));
      }
      callback(items);
    });
  } else if(type == 'tabs') {
    var items = [];
    for(id in bg.activeTabs) {
      var tab = bg.activeTabs[id]
      if(tab.id == tabId) continue;
      if(tab.windowId != winId) continue;
      items.push(new Item(tab.title, tab.url, {
        tabid: tab.id,
        windowid: tab.windowId,
        index: tab.index
      },function(item, t){
        if(t.button == 0 || t.button == 1)
          chrome.tabs.update(item.tabid, {selected:true}, function() {
            if(t.button == 0) chrome.tabs.remove(tabId); });
      },function(item1,item2){
        var i1 = item1.view.items.indexOf(item1);
        var i2 = item2.view.items.indexOf(item2);
        item1.index = i1;
        item2.index = i2;
        chrome.tabs.move(item1.tabid, {index:i1});
        chrome.tabs.move(item2.tabid, {index:i2});
      }));
    }
    callback(items);
  } else if(type == 'bookmarks') {
    chrome.bookmarks.getTree(function(tree) {
      var items = [];
      items.bmktree = tree[0].children[1];
      items.getroot = function() {
        if(items.root) return items.root;
        items.root = items.children(items.bmktree);
        return items.root;
      }
      items.children = function(node) {
        if(!node.children) return null;
        if(node.children.length == 0 || node.children[0].bmkid || node.children[0].bmkfolderid) return node.children;
        var bmks = node.children;
        node.children = [];
        for(var i=0; i<bmks.length; i++) {
          var bmk = bmks[i];
          for(var j=0; j<items.length; j++) if(items[j].bmkid == bmk.id) { items.splice(j,1); break; }
          if(bmk.children) {
            var item = new Item(bmk.title, "", {
              bmkfolderid: bmk.id,
              index: bmk.index,
              time: bmk.dateAdded,
              parent: node,
              children: bmk.children
            });
            items.push(item);
            node.children.push(item);
          } else {
            var item = new Item(bmk.title, bmk.url, {
              bmkid: bmk.id,
              index: bmk.index,
              time: bmk.dateAdded,
              parent: node
            },function(item, t){
              if(t.button == 0)
                chrome.tabs.update(tabId, {url:item.url});
              else if(t.button == 1)
                chrome.tabs.create({url:item.url});
            });
            items.push(item);
            node.children.push(item);
          }
        }
        return node.children;
      }
      chrome.bookmarks.getRecent(20, function(bmks) {
        for(var i=0; i<bmks.length; i++) {
          var bmk = bmks[i];
          if(bmk.parentId == 1) continue;
          if(bmk.title.match(/^smoothgestures-/)) continue;
          if(!bmk.url) continue;
          items.push(new Item(bmk.title, bmk.url, {
            bmkid: bmk.id,
            index: bmk.index,
            time: bmk.dateAdded
          },function(item, t){
            if(t.button == 0) {
              var jscript = item.url.match(/^javascript:(.*)$/);
              if(jscript)
                setTimeout(function() { eval(jscript[1]); }, 0);
              else
                chrome.tabs.update(tabId, {url:item.url});
            } else if(t.button == 1)
              chrome.tabs.create({url:item.url});
          }));
        }
        callback(items);
      });
    });
  } else if(type == 'history') {
    chrome.history.search({text:"", maxResults:20}, function(hists) {
      var items = [];
      for(var i=0; i<hists.length; i++) {
        var hist = hists[i];
        items.push(new Item(hist.title, hist.url, {
          histid: hist.id,
          histcount: hist.visitCount,
          time: hist.lastVisitTime
        },function(item, t){
          if(t.button == 0)
            chrome.tabs.update(tabId, {url:item.url});
          else if(t.button == 1)
            chrome.tabs.create({url:item.url});
        }));
      }
      callback(items);
    });
  } else if(type == "speeddial") {
    chrome.bookmarks.getTree(function(tree) {
      var bmkbar = tree[0].children[0];
      var items = [];
      for(var i=0; i<bmkbar.children.length; i++) {
        var bmk = bmkbar.children[i];
        if(!bmk.url) continue;
        items.push(new Item(bmk.title, bmk.url, {
          bmkid: bmk.id,
          index: bmk.index,
          time: bmk.dateAdded
        },function(item, t){
          if(t.button == 0)
            chrome.tabs.update(tabId, {url:item.url});
          else if(t.button == 1)
            chrome.tabs.create({url:item.url});
        },function(item1,item2){
          var i1 = item1.view.items.indexOf(item1);
          var i2 = item2.view.items.indexOf(item2);
          item1.index = i1;
          item2.index = i2;
          chrome.bookmarks.move(item1.bmkid, {parentId:bmkbar.id, index:i1});
          chrome.bookmarks.move(item2.bmkid, {parentId:bmkbar.id, index:i2});
        }));
      }
      callback(items);
    });
  }
}








resize = null;
window.addEventListener("resize", function() {
  if(!views[ls('view')]) return;
  if(!resize) {
    resize = setTimeout(function() {
      resize = null;
    }, 500);
    views[ls('view')].layoutUpdate();
  } else {
    clearTimeout(resize);
    resize = setTimeout(function() {
      views[ls('view')].layoutUpdate();
      resize = null;
    }, 500);
  }
}, true);

