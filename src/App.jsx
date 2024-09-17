import { useRef, useState } from 'react';
import './App.css';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal'; // Import the Modal component
import Button from 'react-bootstrap/Button'; // Import the Button component

const API_URL = 'https://api.unsplash.com/search/photos';
const API_KEY = 'SHKIwU9QWNHiVIIuxi6WiyXaIYr8MQ-3AsLq8XygmaI';

function App() {
  const searchbar = useRef(null);
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [showModal, setShowModal] = useState(false); // State to manage modal visibility
  const [selectedImage, setSelectedImage] = useState(null); // State to store the selected image

  const handleSearch = async (event) => {
    event.preventDefault();
    const searchQuery = searchbar.current.value;

    if (!searchQuery) {
      return;
    }

    setQuery(searchQuery);
    setPage(1);

    try {
      const response = await fetch(`${API_URL}?query=${searchQuery}&page=1&client_id=${API_KEY}`);
      const data = await response.json();
      setImages(data.results);
      setTotalPages(data.total_pages);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
    window.scrollTo(0, 0);
  };

  const fetchImages = async (pageNum) => {
    try {
      const response = await fetch(`${API_URL}?query=${query}&page=${pageNum}&client_id=${API_KEY}`);
      const data = await response.json();
      setImages(data.results);
      setTotalPages(data.total_pages);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const handleSelection = (selection) => {
    searchbar.current.value = selection;
    handleSearch({ preventDefault: () => {} });
  };

  const handleNextPage = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchImages(nextPage);
    window.scrollTo(0, 0);
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      const previousPage = page - 1;
      setPage(previousPage);
      fetchImages(previousPage);
      window.scrollTo(0, 0);
    }
  };

  // Function to open the modal and set the selected image
  const openModal = (image) => {
    setSelectedImage(image);
    setShowModal(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedImage(null);
  };

  return (
    <>
      <div className="container">
        <h1 className="text_h1">Image Search</h1>
        <div className="search_section">
          <Form onSubmit={handleSearch}>
            <Form.Control
              type="search"
              placeholder="Type something to search..."
              className="search_bar"
              aria-label="Search"
              ref={searchbar}
            />
          </Form>
        </div>
        <div className="filter">
          <button onClick={() => handleSelection('nature')}>Nature</button>
          <button onClick={() => handleSelection('cats')}>Cats</button>
          <button onClick={() => handleSelection('birds')}>Birds</button>
          <button onClick={() => handleSelection('Dog')}>Dog</button>
        </div>
        <div className="image_grid">
          {images.map((image) => (
            <div key={image.id} className="image_item" onClick={() => openModal(image)}>
              <img src={image.urls.small} alt={image.alt_description} />
            </div>
          ))}
        </div>
        {images.length > 0 && (
          <div className="pagination_buttons">
            <button onClick={handlePreviousPage} disabled={page === 1}>
              Previous
            </button>
            {page < totalPages && (
              <button onClick={handleNextPage}>
                Next
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal for displaying the selected image */}
      <Modal show={showModal} onHide={closeModal} size="lg" className='modal_section'>
        <Modal.Header closeButton>
          <Modal.Title>Image Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedImage && (
            <img src={selectedImage.urls.full} alt={selectedImage.alt_description} className="img-fluid image_section_modal" />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default App;
