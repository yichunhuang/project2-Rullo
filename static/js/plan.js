const decodeURL = decodeURI(location.search);
		const URL = decodeURL.split("?")[1];
	if (URL != undefined) {
		let c = URL.substring(15);
		if (c == "true") {
			alert("發生錯誤！請重新新增計畫！");
		}
	}
	let count;
	function addInput(id, placeholder, name, hidden) {
		let table = document.getElementById(id);
		let rownum = table.rows.length;
		let row = table.insertRow(rownum);
		let cell1 = row.insertCell(0); 
		cell1.innerHTML = "<input type='text' name='" + name + "'  class='form-control' style='width:733px;margin:5px;display:inline-block;' placeholder=" + placeholder + " ><i class='fas fa-times-circle' style='color:pink;padding:3px;' onClick='removeInput(this)'></i>";
		count = rownum + 1; //代表table #row
		let hiddens = document.getElementById(hidden);
		hiddens.innerHTML = "<input type=hidden name='" + hidden + "' value= " + count + ">";
	}
	function addTrig(id, placeholder, name, hidden) {
		let table = document.getElementById(id);
		let rownum = table.rows.length;
		let row = table.insertRow(rownum);
		let cell1 = row.insertCell(0); //
		cell1.innerHTML = "<input type='time' name='triggerTime' display:inline-block;>" + "<input type=text name='" + name + "' style='width:633px;margin:5px;display:inline-block;'   class='form-control'  placeholder=" + placeholder + " >"+'<i class="fas fa-times-circle" style="color:pink;padding:1px;" onClick="removeInput(this)"></i>';
		count = rownum + 1; //代表table #row
		let hiddens = document.getElementById(hidden);
		hiddens.innerHTML = "<input type=hidden name='" + hidden + "' value= " + count + ">";
	}
	function removeInput(button) {
		button.closest('tr').remove();	
	}
	document.write('<script src="js/googleLogin.js" ></script>');

