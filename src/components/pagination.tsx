import React from "react";
import PropTypes from "prop-types";
import PaginationBT from 'react-bootstrap/Pagination';
interface Props {
  currentPage: number;
  totalPages: number;
  handleNextPage: (page: number) => void;
  handlePrevPage: (page: number) => void;
  handleFirstPage: (page: number) => void;
  handleLastPage: (page: number) => void;
  goToPage: (page: number) => void;
}
const Pagination: React.FC<Props> = ({
  currentPage,
  totalPages,
  handlePrevPage,
  handleNextPage,
  handleFirstPage,
  handleLastPage,
  goToPage
}) => {
  const items = Array.from(Array(totalPages).keys());
  return (
    <PaginationBT>      
      <PaginationBT.First onClick={() => handleFirstPage(items[0] + 1)} />
      <PaginationBT.Prev  onClick={() => handlePrevPage(currentPage)} />
        {items.map(item=>(
          <PaginationBT.Item active={(item + 1)===currentPage} onClick={() => goToPage(item + 1)}>{item + 1}</PaginationBT.Item>
        ))}        
      <PaginationBT.Next onClick={() => handleNextPage(currentPage)} />
      <PaginationBT.Last onClick={() => handleLastPage(items[items.length - 1] + 1)} />
    </PaginationBT>    
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  handlePrevPage: PropTypes.func.isRequired,
  handleNextPage: PropTypes.func.isRequired,
  handleFirstPage: PropTypes.func.isRequired,
  handleLastPage: PropTypes.func.isRequired,
  goToPage: PropTypes.func.isRequired
};

export default Pagination;
