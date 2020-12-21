module.exports = (res,error, message, data = null, status = 200) => {
	if(error){
		return res.status(status).json({
			status: !error,
			message,
			status: false,
			code:status,
			data,
		});
	}else{
		return res.status(status).json({
			status: !error,
			message,
			code:status,
			data,
		});
	}
};