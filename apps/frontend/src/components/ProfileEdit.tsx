
import { useState } from 'react';
import styles from '../styles/profileEdit.module.css';
import imageCompression from 'browser-image-compression';
import { useNavigate } from 'react-router-dom';
import { User } from '../type/user';

type Props = {
  user: User;
}

export default function ProfileEdit({ user }: Props) {
  const navigate = useNavigate();
  const [name, setName] = useState(user.name);
  const [intro, setIntro] = useState(user.profile);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [url, setUrl] = useState('/api/images/avatars/' + user.avatarUrl);
  const [updatedUser, setUpdatedUser] = useState<User>(user); 

  const getCompressedAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const avatar: File = e.target.files[0];

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    }

    try {
      const compressedAvatar: File = await imageCompression(avatar, options);
      setAvatar(compressedAvatar);
      setPreviewUrl(URL.createObjectURL(compressedAvatar));
    } catch(error) {
      console.log(error);
    }
  } 

  const onSaved = (updatedUser: User) => {
    setUpdatedUser(updatedUser); 
  };

  const handleSubmit = async () => {
    try {
      if (avatar) {
        const data = new FormData()
        data.append('file', avatar)


        const response = await fetch('http://localhost:8080/api/images/upload', {
          method: 'POST',
          credentials: "include",
          body: data
        });

        const result = await response.json();

        if (!result) {
          throw new Error("upload images")
        }
      }

      const updateRes = await fetch("http://localhost:8080/api/profile", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          profile: intro,
        }),
      });
      if (!updateRes.ok) throw new Error("update failed");
      const updateJson = await updateRes.json();
      const updatedUser = updateJson.data;
      
      onSaved(updatedUser);
      navigate('/' + user.handle + '/profile');
    } catch {
      console.log("エラー")
    }
  }

  return (
    <div className={ styles.wrapper }>
      <div className={ styles.outline }>
        <div className={ styles.content}>
          <div className={ styles.left }>
            <p className={ styles.name }>表示名</p>
            <input className={ styles.nameField } value={ name } type="text"  onChange={(e) => setName(e.target.value)}/>
            <p className={ styles.intro}>自己紹介</p>
            <textarea
              name="introArea"
              id="introArea"
              className={styles.introArea}
              value={intro ?? ""}
              placeholder="自己紹介を書いてみよう"
              onChange={(e) => setIntro(e.target.value)}
            />

          </div>
          <div className={ styles.right }>
            { previewUrl && <img src={ previewUrl } alt='avatar' className={ styles.avatar }/>}
            { !previewUrl && <img src={ url } alt="avatar" className={ styles.avatar }/>}
            <input type="file" id="avatar" name="avatar" className={ styles.imageSelector } accept="image/*, .pdf" onChange={getCompressedAvatar}/>
            <button className={ styles.save } onClick={handleSubmit}>保存</button>
          </div>
        </div>
      </div>
    </div>
  );
}