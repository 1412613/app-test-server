import App from './App';
const PORT = process.env.PORT || 4000;

App.listen(PORT, (err) => {
    if(err){
        console.log(err);
    }else{
        console.log('Express server listening on port', PORT);
    }
})