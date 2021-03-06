$( document ).ready(function() {
    bindElements();
});
function bindElements() {
	$("#walgen").click(function() {
		hideAllMainContainers();
		$("#walletgenerator").show();
        $("#walgen").addClass('btnselected');
	});
	$("#bulkgen").click(function() {
		hideAllMainContainers();
		$("#bulkgenerater").show();
        $("#bulkgen").addClass('btnselected');
	});
    $("#generatewallet").click(function() {
		generateSingleWallet();
	});
    $("#printqr").click(function() {
		printQRcode();
	});
    $("#bulkgenerate").click(function() {
		generateBulkWallets();
	});
}

function hideAllMainContainers() {
	$("#walletgenerator").hide();
	$("#bulkgenerater").hide();
    $("#bulkgen").removeClass('btnselected');
    $("#walgen").removeClass('btnselected');
}
function generateSingleWallet(){
    var password = $("#ethgenpassword").val();
    if(password==""){
        alert("Your forgot the password");
        return;
    }
    if(password.length<7){
        alert("Password is not long enough");
        return;
    }
    $("#generatedWallet").show();
    var acc = new Accounts();
    var newAccountEnc = acc.new(password);
    $("#address").val(newAccountEnc.address);
    var newAccountUnEnc = acc.get(newAccountEnc.address, password);
    $("#privkey").val(newAccountUnEnc.private);
    $("#qrcodeAdd").empty();
    new QRCode($("#qrcodeAdd")[0], {
        text: newAccountEnc.address,
        width: $("#qrcode").width(),
        height: $("#qrcode").width(),
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });
    $("#qrcode").empty();
    new QRCode($("#qrcode")[0], {
        text: newAccountUnEnc.private,
        width: $("#qrcode").width(),
        height: $("#qrcode").width(),
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });
    var fileType = "text/json;charset=UTF-8";
    var encblob = new Blob( [ JSON.stringify(newAccountEnc) ], { type: fileType } );
    var unencblob = new Blob( [ JSON.stringify(newAccountUnEnc) ], { type: fileType } );
    $("#encdownload").attr('href',window.URL.createObjectURL(encblob));
    $("#encdownload").attr('download',newAccountEnc.address+'-Encrypted.json');
    $("#unencdownload").attr('href',window.URL.createObjectURL(unencblob));
    $("#unencdownload").attr('download',newAccountEnc.address+'-Unencrypted.json');
    acc.clear();
}
function generateBulkWallets(){
    var password = $("#bulkgenpassword").val();
    var count = $("#numberwallets").val();
    if(count==""){
        alert("Please enter the amount of wallets you need");
        return;
    } else if(count != parseInt(count, 10)){
        alert("Digits only please");
        return;
    }
    var isencrypted = false;
    if(password!=""&&password.length<7){
        alert("Password is not long enough");
        return;
    } else if(password!=""&&password.length>=7){
        isencrypted = true;
    }
    if(isencrypted)
        $("#bulkIsEnc").html(" (Encrypted)")
    else
        $("#bulkIsEnc").html(" (Unencrypted)")
    $("#generatedbulkwallets").show();
    $('#bulkgentable tr:not(:first)').remove();
    var acc = new Accounts();
    var csv = "";
    var jsonarr = [];
    var txt = "";
    for(var i=0;i<count;i++){
        if(isencrypted)
            var newAccount = acc.new(password);
        else
            var newAccount = acc.new();
        $('#bulkgentable tr:last').after('<tr class="privaddkey"><td>'+newAccount.address+'</td><td>'+newAccount.private+'</td></tr>');
        csv+=newAccount.address+','+newAccount.private+'\n';
        txt+=newAccount.address+'\t'+newAccount.private+'\n';
        jsonarr.push({address:newAccount.address, private:newAccount.private});
    }
    var csvblob = new Blob( [ csv ], { type: "text/csv;charset=UTF-8" } );
    var txtblob = new Blob( [ txt ], { type: "text/plain;charset=UTF-8" } );  
    var jsonblob = new Blob( [ JSON.stringify(jsonarr) ], { type: "text/json;charset=UTF-8" } ); 
    var fname = "bulk_ether_accounts" ;
    $("#bulkexportjson").attr('href',window.URL.createObjectURL(jsonblob));
    $("#bulkexportjson").attr('download',fname+'.json');
    $("#bulkexportcsv").attr('href',window.URL.createObjectURL(csvblob));
    $("#bulkexportcsv").attr('download',fname+'.csv');
    $("#bulkexporttxt").attr('href',window.URL.createObjectURL(txtblob));
    $("#bulkexporttxt").attr('download',fname+'.txt');
    acc.clear();
}
function printQRcode() {
    var address = $("#address").val();
    var qrsourceprivkey = $("#qrcode").html();
    var qrsourceadd = $("#qrcodeAdd").html();
    var html = "<h4>Address ("+address+")</h4><br/>"+qrsourceadd+"<h4>Private Key</h4></br>"+qrsourceprivkey;
    var win = window.open("about:blank","_blank");
    win.document.write(html);
    win.focus();
    win.print();
}
HTMLElement.prototype.click = function() {
   var evt = this.ownerDocument.createEvent('MouseEvents');
   evt.initMouseEvent('click', true, true, this.ownerDocument.defaultView, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
   this.dispatchEvent(evt);
}