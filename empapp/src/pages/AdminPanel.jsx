import "../styles/variables.css";
import styles from "./AdminPanel.module.css";
import { auth } from "../../firebase_config";
import useFetchApplication from "../store/useFetchApplication";
import useAdminPanel from "../store/useAdminPanel";
import SignInModal from "../components/SignInModal/SignInModal";
import { Link } from "react-router-dom";
import AdminTestModal from "../components/AdminTestModal/AdminTestModal";
import useAdminTest from "../store/useAdminTest";
import { useState } from "react";

const AdminPanel = () => {
  const [modalKey, setModalKey] = useState(0);
  const {
    applications,
    show,
    handleClose,
    handleLoginAndCheckAdmin,
    isAdmin,
    isLoading,
  } = useFetchApplication();

  const { searchTerm, setSearchTerm, getFilteredApplications, handleReject } =
    useAdminPanel();

  const { showModal, handleCloseModal, openModal, currentApplication } =
    useAdminTest();

  const filteredApplications = getFilteredApplications(applications);

  if (isLoading) {
    return (
      <div className={styles.adminContainer}>
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Yükleniyor...</span>
          </div>
          <p className="mt-2">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.adminContainer}>
      <div className="container">
        <div className={`${styles.header} d-flex justify-content-between`}>
          <h1 className={styles.title}>Başvuruları Yönet</h1>
          <Link to="/" className={styles.backButton}>
            <i className="bi bi-arrow-left"></i> Başvuru Sayfasına Dön
          </Link>
        </div>
        <p className="text-center">
          Bu sayfada başvurular listelenecek ve admin tarafından
          değerlendirilecek.
        </p>

        {!auth.currentUser ? (
          <div className={styles.messageContainer}>
            <p className="alert alert-info">
              Başvuruları görüntülemek için lütfen giriş yapın
            </p>
            <button
              className={styles.loginButton}
              onClick={handleLoginAndCheckAdmin}
            >
              Giriş yap
            </button>
          </div>
        ) : !isAdmin ? (
          <div className={styles.messageContainer}>
            <p className="alert alert-warning">
              Bu sayfa sadece admin tarafından görüntülenebilir
            </p>
          </div>
        ) : (
          <>
            <div className="row my-3">
              <div className="col-md-12">
                <input
                  type="text"
                  className={styles.searchInput}
                  placeholder="İsim veya yetenek girin"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="row">
              {filteredApplications.map((app) => (
                <div key={app.id} className="col-md-4 mb-4">
                  <div className={styles.applicationCard}>
                    <div className={styles.cardBody}>
                      <h5 className={styles.cardTitle}>
                        {app.name} {app.lastName}
                      </h5>
                      <p className={styles.cardText}>
                        <strong>Adres:</strong> {app.adressFirst},{" "}
                        {app.adressSecond}
                      </p>
                      <p className={styles.cardText}>
                        <strong>Şehir:</strong> {app.city} - {app.province}
                      </p>
                      <p className={styles.cardText}>
                        <strong>Posta Kodu:</strong> {app.postCode}
                      </p>
                      <p className={styles.cardText}>
                        <strong>Ülke:</strong> {app.country}
                      </p>
                      <p className={styles.cardText}>
                        <strong>Telefon:</strong> {app.phoneNumber}
                      </p>
                      <p className={styles.cardText}>
                        <strong>Email:</strong> {app.email}
                      </p>
                      <p className={styles.cardText}>
                        <strong>Doğum Tarihi:</strong> {app.birthday}
                      </p>
                      <p className={styles.cardText}>
                        <strong>Türk mü?</strong>{" "}
                        {app.isTurkish ? "Evet" : "Hayır"}
                      </p>
                      {app.skills && (
                        <p className={styles.cardText}>
                          <strong>Yetenekler:</strong>
                          <span className={styles.skillsContainer}>
                            {app.skills.split(",").map((skill, index) => (
                              <span key={index} className={styles.skillBadge}>
                                {skill.trim()}
                              </span>
                            ))}
                          </span>
                        </p>
                      )}
                      <p className={styles.cardText}>
                        <strong>Üniversite:</strong> {app.university}
                      </p>
                      <p className={styles.cardText}>
                        <strong>Mezun mu?</strong>{" "}
                        {app.isGraduate ? "Evet" : "Hayır"}
                      </p>
                      <div
                        className={`card-footer gap-4 d-flex justify-content-center ${styles.fontPrimary} ${styles.cardBackGround}`}
                      >
                        <button
                          className={`${styles.approveButton} btn text-white mt-2`}
                          onClick={() => {
                            openModal(app);
                            setModalKey((prevKey) => prevKey + 1);
                          }}
                        >
                          Onayla
                        </button>

                        <button
                          className={` ${styles.rejectButton} btn text-white mt-2`}
                          onClick={() => handleReject(app)}
                        >
                          Reddet
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        <AdminTestModal
          key={modalKey}
          show={showModal}
          handleClose={handleCloseModal}
          app={currentApplication}
        />
        <SignInModal show={show} handleClose={handleClose} />
      </div>
    </div>
  );
};

export default AdminPanel;
