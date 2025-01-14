import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";
import loader from "../assets/loader.gif";
import { setAvatarRoute } from "../utils/APIRoutes";

export default function SetAvatar() {
  const api = `https://api.multiavatar.com/4645646`;
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  // Checking if the user is logged in
  useEffect(() => {
    if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/login");
    }
  }, [navigate]);

  // Function to set the selected avatar as the profile picture
  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please select an avatar", toastOptions);
    } else {
      const user = JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));

      try {
        const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
          image: avatars[selectedAvatar],
        });

        if (data.isSet) {
          user.isAvatarImageSet = true;
          user.avatarImage = data.image;
          localStorage.setItem(process.env.REACT_APP_LOCALHOST_KEY, JSON.stringify(user));
          navigate("/");
        } else {
          toast.error("Error setting avatar. Please try again.", toastOptions);
        }
      } catch (error) {
        toast.error("Error connecting to the server. Please try again.", toastOptions);
      }
    }
  };

  // Fetching avatars from the API
  useEffect(() => {
    const fetchAvatars = async () => {
      const data = [];
      try {
        for (let i = 0; i < 4; i++) {
          const image = await axios.get(`${api}/${Math.round(Math.random() * 1000)}`);
          // Converting image data to base64 using btoa() instead of Buffer
          const base64Image = btoa(image.data);
          data.push(base64Image);
        }
        setAvatars(data);
        setIsLoading(false);
      } catch (error) {
        toast.error("Failed to load avatars. Please try again.", toastOptions);
      }
    };
  
    fetchAvatars();
  }, [api, toastOptions]);

  return (
    <>
      {isLoading ? (
        <Container>
          <img src={loader} alt="loader" className="loader" />
        </Container>
      ) : (
        <Container>
          <div className="title-container">
            <h1>Pick an Avatar as your profile picture</h1>
          </div>
          <div className="avatars">
            {avatars.map((avatar, index) => (
              <div
                key={index} // Unique key for each avatar
                className={`avatar ${selectedAvatar === index ? "selected" : ""}`}
                onClick={() => setSelectedAvatar(index)}
              >
                <img src={`data:image/svg+xml;base64,${avatar}`} alt="avatar" />
              </div>
            ))}
          </div>
          <button onClick={setProfilePicture} className="submit-btn">
            Set as Profile Picture
          </button>
          <ToastContainer />
        </Container>
      )}
    </>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background-color: #131324;
  height: 100vh;
  width: 100vw;

  .loader {
    max-inline-size: 100%;
  }

  .title-container {
    h1 {
      color: white;
      text-align: center;
    }
  }

  .avatars {
    display: flex;
    gap: 2rem;
    justify-content: center;
    align-items: center;

    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      transition: 0.5s ease-in-out;

      img {
        height: 6rem;
        width: 6rem;
        border-radius: 50%;
        object-fit: cover;
        transition: 0.3s ease-in-out;
      }

      &:hover {
        transform: scale(1.1);
        border-color: #4e0eff;
      }

      &.selected {
        border-color: #4e0eff;
        transform: scale(1.1);
      }
    }
  }

  .submit-btn {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #3a0bdb;
    }

    &:disabled {
      background-color: #cccccc;
      cursor: not-allowed;
    }
  }
`;
