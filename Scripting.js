// JavaScript source code


function paginacurenta() {
    //localStorage.clear();
    console.log(window.location);
    var x = document.getElementsByTagName("a");
    var i = 0;
    for (i = 0; i < x.length; i++) {
        if (x[i].href == window.location)
            x[i].className = "current";
    }
    if( localStorage.length !== 0 ){
        var x = document.getElementById("login");
        document.getElementById("hotbar").removeChild(x);
        x = document.getElementById("signin");
        document.getElementById("hotbar").removeChild(x);
        if( localStorage.length === 1){
            x = document.getElementById("message");
            document.getElementById("body").removeChild(x);
        }
        $.ajax({
            url: 'http://localhost:3000/Users/' + localStorage['userid'],
            type: 'GET',
            dataType: 'json',
            complete: (data) =>{
                console.log(data);
                var x = document.getElementById("name");
                x.innerHTML = "Logged in as " + data.responseJSON['username'];
                if(data.responseJSON['username'] !== "Admin"){
                    x = document.getElementById("administer");
                    document.getElementById("hotbar").removeChild(x);
                }
            }
        })
        if( localStorage.length === 2){
            var mess = localStorage["message"];
            localStorage.removeItem("message");
            $.ajax({
                url: 'http://localhost:3000/Users/' + localStorage['userid'],
                type: 'GET',
                dataType: 'json',
                complete: function(data){
                    var user = data.responseJSON;
                    if( mess === "new"){
                        document.getElementById("message").innerHTML = "Congratulations on joining!";
                    }
                    else{
                        console.log(data);
                        var d = new Date(user['lastloggedin']);
                        document.getElementById("message").innerHTML = 'You have last logged in on '
                        + d + ' from the IP address ' +
                        user['lastip'] + '. You have logged in ' + (Number(user['nbvisits'])+ 1) + ' times.';
                        var date = new Date();
                        date = JSON.stringify(date);
                        $.getJSON('https://api.ipify.org?format=jsonp&callback=?', (data) => {
                            user['lastip'] = data["ip"];
                        });
                        user['lastloggedin'] = date.substring(1, date.length-1);
                        user['nbvisits'] = Number(user['nbvisits']) + 1;
                        $.ajax({
                            url: 'http://localhost:3000/Users/' + localStorage['userid'],
                            type: 'PUT',
                            data: user,
                            succes: (data) =>{
                                console.log('success');
                            }
                        })
                    }
                }
            })
        }
    } else{
        var x = document.getElementById("notebook");
        document.getElementById("hotbar").removeChild(x);
        var x = document.getElementById("logout");
        document.getElementById("hotbar").removeChild(x);
        x = document.getElementById("name");
        document.getElementById("hotbar").removeChild(x);
        x = document.getElementById("message");
        document.getElementById("body").removeChild(x);
        x = document.getElementById("administer");
        document.getElementById("hotbar").removeChild(x);
    }
    var x = setInterval(amr,1000);
}

function amr(){
    var x = document.getElementById("amr");
    var d = new Date();
    if(d.getMonth() === 12 && d.getDay() >= 25){
        var chr = new Date(d.getFullYear() + 1, 12, 25, 0, 0, 0);
        var p = document.createElement("p");
        var days = Math.trunc((chr-d)/ 24 / 3600000);
        var hours = Math.trunc((chr-d) / 3600000 - days * 24);
        var minutes = Math.trunc((chr-d) / 60000 - days * 24 - hours * 60);
        var seconds = Math.trunc((chr-d) / 1000 - days * 24 - hours * 60 - minutes*60);
        p.innerHTML = "Christmas is in " +  days + " days, " + hours + " hours, " + minutes + " minutes and " + seconds + " seconds.";
        var v = x.children;
        if( v.length === 1){
            x.removeChild(v[0]);
        }
        x.appendChild(p);
    } else{
        var chr = new Date(d.getFullYear(), 12, 25, 0, 0, 0, 0);
        var p = document.createElement("p");
        var days = Math.trunc((chr-d)/ (24 * 3600000));
        var hours = Math.trunc((chr-d) / 3600000 - days * 24);
        var minutes = Math.trunc((chr-d) / 60000 - days * 24 * 60 - hours * 60);
        var seconds = Math.trunc((chr-d) / 1000 - days * 24 * 3600 - hours * 3600 - minutes*60);
        p.innerHTML = "Christmas is in " +  (days - 31) + " days, " + hours + " hours, " + minutes + " minutes and " + seconds + " seconds.";
        var v = x.children;
        if( v.length === 1){
            x.removeChild(v[0]);
        }
        x.appendChild(p);
    }
}

function logout(){
    localStorage.clear();
}

function showpasswrd() {
    var x = document.getElementById("passwrd");
    if (x.type == 'password')
        x.type = 'text';
    else
        x.type = 'password';
}

function wrdcount() {
    var x = document.getElementById('notes');
    var y = x.value;
    y = y.split(" ");
    var c = 0;
    for (cuv in y) {
        if (cuv != '') {
            c++;
        }
    }
    x = document.getElementById('nr').innerHTML = 'Word count : ' + String(c);
}


function insert(usrname, passwrd, date, ip, nbvis) {
    $.ajax({
        url: 'http://localhost:3000/Users',
        type: 'POST',
        data: {
            username: usrname,
            password: passwrd,
            signedup: date.substring(1, date.length - 1),
            lastloggedin: date.substring(1, date.length - 1),
            lastip: ip,
            nbvisits: nbvis,
            written: ""
        },
        success: function (data) {
            console.log(data)
        },
        complete: (data)=>{
            localStorage.setItem("userid", data.responseJSON["id"]);
            localStorage.setItem("message", "new");
            location.replace("file:///C:/Users/carin/Desktop/TW/Articles.html");
        },
        error: function (error) {
            console.log(error);
        }
    })
}

function addUser() {
    var usrname = document.getElementById("usrname").value;
    var passwrd = document.getElementById("passwrd").value;
    var date = new Date();
    date = JSON.stringify(date);
    console.log(date);
    var ip = 0;
    $.getJSON('https://api.ipify.org?format=jsonp&callback=?', (data) => {
        ip = data["ip"];
        insert(usrname, passwrd, date, ip, 1);
    });

}


function getUser(x){
    var id = -1;
    var usrname = 0;
    if( x === "Login"){
        usrname = document.getElementById("usrname").value;
    } else{
        usrname = document.getElementById('exusr').value;
    }
    $.ajax({
        url: 'http://localhost:3000/Users',
        type: 'PUT',
        data: {
            username: usrname
        },
        complete: function(data){
            if( x === "Login"){ 
                var passwrd = document.getElementById("passwrd").value;
                console.log(data);
                if( data.responseText === 'NOT FOUND' || data.responseJSON.password !== passwrd){
                document.getElementById("eroare").innerHTML = "Incorrect username/password. Try again.";
                } else{
                    id = data.responseJSON.id;
                    localStorage.setItem("userid", id);
                    localStorage.setItem("message", "false");
                    location.replace("file:///C:/Users/carin/Desktop/TW/Articles.html");
                }
            } else{
                var del = document.getElementById('admin').children;
                console.log(del);
                var i = del.length - 1;
                while( i >= 4){
                    document.getElementById('admin').removeChild(del[i]);
                    i--;
                }
                if( data.responseText === 'NOT FOUND'){
                    var y = document.createElement("p");
                    y.innerHTML = "User not found.";
                    document.getElementById("admin").appendChild(y);
                } else{
                    var y = document.createElement("p");
                    y.innerHTML = "Username: " + data.responseJSON["username"];
                    document.getElementById("admin").appendChild(y);
                    y = document.createElement("p");
                    var d = new Date(data.responseJSON["signedup"]);
                    y.innerHTML = "Signed-up: " + d;
                    document.getElementById("admin").appendChild(y);
                    y = document.createElement("p");
                    d = new Date(data.responseJSON["lastloggedin"]);
                    y.innerHTML = "Last logged-in: " + d;
                    document.getElementById("admin").appendChild(y);
                    y = document.createElement("p");
                    y.innerHTML = "Number of visits: " + data.responseJSON["nbvisits"];
                    document.getElementById("admin").appendChild(y);
                    y = document.createElement("p");
                    y.innerHTML = "Last IP address used: " + data.responseJSON["lastip"];
                    document.getElementById("admin").appendChild(y);
                }
            }
        }
    })
}

function deleteUser(){
    var x = document.getElementById('exusr').value;
    console.log(x);
    $.ajax({
        url: 'http://localhost:3000/Users',
        type: 'DELETE',
        data: {
            username: x
        },
        complete: function(){
            alert("User " + x + " has been successfully deleted.");
        }
    })
}

function save(){
    var text = document.getElementById("notes").value;
    $.ajax({
        url: 'http://localhost:3000/Users/' + localStorage["userid"],
        type: 'GET',
        dataType: 'json',
        complete: function(data){
            console.log(data);
            var user = data.responseJSON;
            user["written"] = text;
            console.log(text);
            $.ajax({
            url: 'http://localhost:3000/Users/' + localStorage["userid"],
            type: 'PUT',
            data: user,
            complete: function(data){
                    alert("Saved.");
                }
            })
        }
    })
    
}

function lastsaved(){
    $.ajax({
        url: 'http://localhost:3000/Users/' + localStorage["userid"],
        type: 'GET',
        dataType: 'json',
        complete: function(data){
            console.log(data);
            var user = data.responseJSON;
            document.getElementById("notes").value = user["written"];
        }
    })
}

function getNbWrds(){
    var x = document.getElementById('notes');
    var y = x.value;
    y = y.split(" ");
    var c = 0;
    for (cuv in y) {
        if (cuv != '') {
            c++;
        }
    }
    return c;
}

function newArticle(){
    var article = document.getElementById("notes").value;
    var nrwrds = getNbWrds();
    var date = new Date();
    date = JSON.stringify(date);
    date = date.substring(1, date.length-1);
    $.ajax({
        url: 'http://localhost:3000/Users/' + localStorage['userid'],
        type: 'GET',
        dataType: 'json',
        complete: function(user){
            $.ajax({
                url: 'http://localhost:3000/Articles',
                type: 'POST',
                data: {
                    author: user.responseJSON['username'],
                    content: article,
                    uploaddate: date,
                    wordcount: nrwrds
                },
                complete: function(){
                    alert("Article posted.");
                }
            })
        }
    })
}

function loadArticles(){
    document.getElementById("show").style.display = "none";
    document.getElementById("hide").style.display = "block";
    $.ajax({
        url: 'http://localhost:3000/Articles',
        type: 'GET',
        dataType: 'json',
        complete: function(data){
            var Articles = data.responseJSON;
            for( let i = 1 ; i < Articles.length; i++){
                if( Articles[i].dislikes < 4)
                {
                var x = document.createElement("div");
                //x.class='excerpt';
                var y = document.createElement("p");
                y.innerHTML = "On " + Date(Articles[i]["uploaddate"]) + ",  " + Articles[i]["author"] + " said:" ;
                y.setAttribute("font-size", "15px");
                x.appendChild(y);                
                var z = document.createElement("p");
                z.innerHTML = "\"" +  Articles[i]["content"] + "\"";
                z.setAttribute("font-size", "18px");
                x.appendChild(z);
                var a = document.createElement("button");
                a.innerHTML = "👍 : " + Articles[i].likes;
                a.setAttribute("width", "8px");
                a.setAttribute("id", '0'+Articles[i].id);
                a.addEventListener("click", like);
                x.appendChild(a);
                var b = document.createElement("button");
                b.innerHTML = "👎 : " + Articles[i].dislikes;
                b.setAttribute("width", "8px");
                b.setAttribute("id", '1'+Articles[i].id);
                b.addEventListener("click", dislike);
                x.appendChild(b);
                document.getElementById("excerpts").appendChild(x);
                x.setAttribute("class", "excerpt");
            }
            }
        }
    })
}

function hideArticles(){
    document.getElementById("show").style.display = 'block';
    document.getElementById("hide").style.display = "none";
    var v = document.getElementById("excerpts").children;
    while( v.length > 0){
        document.getElementById("excerpts").removeChild(v[v.length-1]);
    }

}

function like(){
    var id = this.id.substring(1, this.id.length);
    var x = this.id;
    $.ajax({
        url: 'http://localhost:3000/Articles/' + id,
        type: 'PUT',
        data: {
            likes: 1,
            dislikes: 0
        },
        complete: function(data){
            document.getElementById(x).innerHTML = "👍 : " + String(data.responseJSON["likes"]);
        }
    })
}

function dislike(){
    var id = this.id.substring(1, this.id.length);
    var x = this.id;
    $.ajax({
        url: 'http://localhost:3000/Articles/' + id,
        type: 'PUT',
        data: {
            likes: 0,
            dislikes: 1
        },
        complete: function(data){
            document.getElementById(x).innerHTML = "👎 : " + String(data.responseJSON["dislikes"]);
        }
    })
}