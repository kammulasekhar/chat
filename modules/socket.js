module.exports = function(io, md5, db) {
    io.on('connection', function(socket) {
        socket.on('check-email', function(email, clientid){
            db.query("SELECT email FROM register WHERE email='"+email+"'", function(err, checkemaildata){
                if(err){
                    io.to(clientid).emit('server-error');
                }else{
                    if(checkemaildata.length !== 0){
                        io.to(clientid).emit('email-exists');
                    }else{
                        io.to(clientid).emit('email-not-exists');
                    }
                }
            });
        });
        socket.on('register', function(registerdata, registeredon, clientid){
            db.query("INSERT INTO register (name,email,mobilenumber,password,image,onlineindication,lastseen,registeredon) VALUES ('"+registerdata.name+"','"+registerdata.email+"','"+registerdata.mobilenumber+"','"+md5(registerdata.confirmpassword)+"','pro-pic.png','offline','"+registeredon+"','"+registeredon+"')", function(err, value){
                if(err){
                    io.to(clientid).emit('register-fail', registerdata, registeredon);
                }else{
                    io.to(clientid).emit('register-success', registerdata, registeredon);
                }
            });
        });
        socket.on('check-credantials-onfailure', function(credantialdata, clientid){
            db.query("SELECT * FROM register WHERE email = '"+credantialdata.useremail+"'", function(err, rows){
              if (err){throw err;}else{
                if(!rows.length){
                    io.to(clientid).emit('check-credantials', 'No account is registered with this email.', credantialdata);
                }else{
                    io.to(clientid).emit('check-credantials', 'Oops! Wrong password.', credantialdata);
                }
              }
            });
        });
        socket.on('get-client-data', function(clientkey){
            if('passport' in socket.request.session){
                if(socket.request.session.passport.user === clientkey){
                    socket.join(clientkey);
                    db.query("SELECT * FROM register WHERE email='"+clientkey+"'", function(err, clientdata){
                        if(err){io.to(clientkey).emit('server-error');}else{
                            if(clientdata.length){
                                io.to(clientkey).emit('client-data-found', clientdata[0]);
                            }else{io.to(clientkey).emit('client-data-not-found');}
                        }
                    });
                }else{io.to(clientkey).emit('client-data-not-found');}
            }else{io.to(clientkey).emit('client-data-not-found');}
        });
        socket.on('push-client', function(client){
            db.query("UPDATE register SET onlineindication='online',lastseen='' where email='"+client.email+"'", function(err){
                if(err){io.to(client.clientid).emit('server-error');}else{
                    clients.push(client);
                    socket.join(client.email);
                    for(var i=0; i<clients.length; i++){
                        for(var j=i+1; j<clients.length; j++){
                            if(clients[i].email === clients[j].email){
                                clients.splice(i,1);
                            }
                        }
                    }
                    io.emit('online-clients', clients);
                }
            });
        });

        socket.on('get-contacts', function(clientdata){
            db.query("SELECT id,name,email,mobilenumber,image,onlineindication,lastseen FROM register where email!='"+clientdata.email+"'", function(err, contactsdata){
                if(err){io.to(clientdata.email).emit('server-error');}else{
                    io.to(clientdata.email).emit('contacts', contactsdata);
                }
            });
            io.clients((error, clients) => {
                if (error) throw error;
                console.log(clients);
            });
        });

        socket.on('send-message', function(message, reciever, sender){
            io.to(reciever).to(sender).emit('recieve-message', message);
        });

        socket.on('logout', function(clientdata){
            socket.leave(clientdata.email);
        });
    });
};