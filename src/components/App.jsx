import { useState, useEffect } from "react";
import { ImageGallery } from "./ImageGallery/ImageGallery";
import { Searchbar } from "./Searchbar/Searchbar";
import { Button } from "./Button/Button";
import { Hearts } from "react-loader-spinner";
import { Modal } from "./Modal/Modal";
import { searchImages } from "services/API";

import { Wrapper, HeartsWrapper, ShitySearch } from "./App.styled";

const Status = {
  EMPTY: 'empty',
  FAIL: 'fail',
  WELLDONE: 'wellDone'
}

export function App() {
  
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [largeImage, setLargeImage] = useState('');
  const [status, setStatus] = useState(Status.EMPTY)

useEffect(()=>{
  if (!query) { 
    return
  }

  setLoading(true)
  searchImages({ query: query, page: page })
    .then(({ totalHits, hits }) => {
      if (totalHits) {
        setImages(images => [...images, ...hits]);
        setTotal(totalHits);
        setStatus(Status.WELLDONE);
      } else {
        setStatus(Status.FAIL)
      }
    }).then(() => setLoading(false))
    .catch(error => {
      console.log(error);
      setStatus(Status.FAIL)
    });
       
  
},[page, query])


const handleFormSubmit = e => {
    e.preventDefault();
    const query = e.target.elements.query.value.trim().toLowerCase();

    if (!query) {
      alert('Saerch is Empty')
      return;
    }

  setPage(1);
  setQuery(query);
  setImages([])

    e.target.reset();
}
  
const loadMore = () => {
    setPage(
      page => page+1
    )
}
  
const openModal = image => {
setLargeImage(image)
}
  
const closeModal = () => {
setLargeImage('')
}
  
  
const totalPage = total / (page * images.length); 
  
if (status===Status.EMPTY) {
    return (
      <Wrapper>
      <Searchbar onSubmit={handleFormSubmit} />
      <h1>TRY TO <ShitySearch>SEARCH</ShitySearch> SOMETHING!</h1>
      </Wrapper>
  )
  }

if (status === Status.FAIL) {
    return (
      <Wrapper>
      <Searchbar onSubmit={handleFormSubmit} />
      <h1>Nothing with <ShitySearch>{query}</ShitySearch> i could find!</h1>
      </Wrapper> )
  }

if (status === Status.WELLDONE) {
    return (
      <Wrapper>
    <Searchbar onSubmit={handleFormSubmit} />
       <HeartsWrapper>
        {loading &&
            <Hearts 
            height="300"
            width="300"
            color="#3f51b5"
            ariaLabel="hearts-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />}
        </HeartsWrapper> 
        {images.length > 0 && <ImageGallery items={images} onClick={openModal} />}
        {totalPage>1 && <Button onClick={loadMore} />}
        {largeImage.length > 0 && ( <Modal image ={largeImage} onClose={closeModal} />)}
    </Wrapper>)
    
  }
};
 