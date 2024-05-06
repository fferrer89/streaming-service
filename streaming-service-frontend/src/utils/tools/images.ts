const getImageUrl = (id: string) => {
       
    return `http://localhost:4000/file/download/${id}`;
};

export  {getImageUrl};