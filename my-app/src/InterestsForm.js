import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router';
import './Interest.css';
import { useState } from 'react';

function InterestsForm() {
    const { state } = useLocation();
    const navigate = useNavigate();
    
    const [price, setPrice] = new useState(50);
    const [tempPrice, setTempPrice] = new useState(50);
    const [places, setPlaces] = new useState([]);
    const [desc, setDesc] = new useState("");
    const [error, setError] = new useState(false);

    const getCookie = (name) => {
        const cookies = document.cookie.split('; ');
        const cookie = cookies.find((row) => row.startsWith(`${name}=`));
        return cookie ? decodeURIComponent(cookie.split('=')[1]) : null;
    };

    const onChangePrice = (newPrice) => {
        let aux;
        if (newPrice > 10000) aux = 10000;
        else if (newPrice < 50) aux = 50;
        else aux = newPrice;
        setPrice(aux)
        setTempPrice(aux);
    }

    const onClickPlaces = (place) => {
        let found = false;
        let aux = [];
        places.map((item) => {
            if (item != place) aux.push(item);
            else found = true;
        });
        if (!found) aux.push(place);
        if (aux.length == 0) setError(true)
        else setError(false)
        setPlaces(aux);
    }

    const onSubmit = () => {
        if (places.length === 0) setError(true);
        else {
            let data = {
                places: places,
                price: price,
                desc: desc,
                group_id: state.group_id
            }

            //TODO modificar endpoint
            fetch('http://localhost:5000/api/v1', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${getCookie('auth_token')}`,
                },
                body: JSON.stringify(data),
            }).then(() => navigate("../End", { state: state }))
            .catch((err) => console.error(err));
        }
    }

    return (
        <div className='interests'>
            <h1 className='interestsTitle'>Choose your preferences</h1>

            <form onSubmit={() => onSubmit()}>
                <label htmlFor='place' className='interestsLabel placeLabel'>What are you more into?</label>
                {error && (<label htmlFor='place' className='interestsLabel placeLabelError'><i>You must select at least one</i></label>)}
                <div className='placeDiv' id='place' name='place'>
                    <div className={places.includes("beach") ? 'placeItemSelected' : 'placeItem'} onClick={() => onClickPlaces("beach")}>
                        <h3>Beach</h3>
                        <img src='https://media.gq.com.mx/photos/620e915c43f71a078a35533f/master/pass/playa.jpg' />
                    </div>
                    <div className={places.includes("mountain") ? 'placeItemSelected' : 'placeItem'} onClick={() => onClickPlaces("mountain")}>
                        <h3>Mountain</h3>
                        <img src='https://st3.idealista.com/news/archivos/styles/fullwidth_xl/public/2018-08/selva_de_tailandia.jpg?VersionId=aMXkAZ8SqV6OL7NwVSjLPS1cMwCTAexO&itok=yKqmBKu1' />
                    </div>
                    <div className={places.includes("village") ? 'placeItemSelected' : 'placeItem'} onClick={() => onClickPlaces("village")}>
                        <h3>Village</h3>
                        <img src='https://i0.wp.com/travelandleisure-es.com/wp-content/uploads/2024/04/Pueblo-Rustico.jpg?fit=2560%2C1714&ssl=1' />
                    </div>
                    <div className={places.includes("big city") ? 'placeItemSelected' : 'placeItem'} onClick={() => onClickPlaces("big city")}>
                        <h3>Big city</h3>
                        <img src='https://www.lagrietaonline.com/wp-content/uploads/2015/04/La-ciudad-la-gran-ciudad.jpg' />
                    </div>
                </div>

                <label htmlFor="price" className='interestsLabel'>Max price (between 50 and 10000):</label>
                <div className='priceDiv'>
                    <input type="range" className='priceRange' id="price" name="price" min="0" max="10000" onChange={(e) => onChangePrice(e.target.value)} value={price} />
                    <input type='number' className='priceInput' min="0" max="10000" value={tempPrice} onChange={(e) => setTempPrice(e.target.value)} onMouseLeave={() => onChangePrice(tempPrice)} required />
                </div>

                <label htmlFor='desc' className='interestsLabel'>Could you give as any other specifications?</label>
                <textarea className='descInput' id='desc' name='desc' placeholder='Ex: A beautiful city with great views and treking routes' onChange={(e) => setDesc(e.target.value)} required maxLength={500} />

                <button type='submit' className='interestsButton'>Send preferences</button>
            </form>
        </div>
    );
}

export default InterestsForm;