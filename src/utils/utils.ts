export const TotalPages =  (totalPages: number, regPerpage :  number) => {    
    return totalPages % regPerpage === 0 ? totalPages / regPerpage : Math.ceil(totalPages / regPerpage);
}
