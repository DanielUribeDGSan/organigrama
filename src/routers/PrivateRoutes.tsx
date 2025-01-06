// import { Navigate, Route, Routes } from "react-router-dom";

// import { Home } from "../screens/home/Home";

// import { ListOfCourses } from "../screens/list-of-courses/ListOfCourses";
// import { MyApplications } from "../screens/my-applications/MyApplications";
// import { SearchCourses } from "../screens/search-courses/SearchCourses";
// import { CourseInformation } from "../screens/course-information/CourseInformation";
// import { RegisterCourse } from "../screens/register-course/RegisterCourse";
// import { PendingApplications } from "../screens/pending-applications/PendingApplications";
// import { ApplicationInformation } from "../screens/application-information/ApplicationInformation";
// import { CourseInformationMyApplication } from "../screens/my-application-information/CourseInformationMyApplication";
// import { HistorialRequest } from "../screens/historial-request/HistorialRequest";
// import { ChangeUser } from "../screens/change-user/ChangeUser";

// const PrivateRoutes = () => {
//   return (
//     <Routes>
//       <Route path="/" element={<Home />} />
//       <Route path="/lista-de-cursos" element={<ListOfCourses />} />
//       <Route path="/solicitudes-pendientes" element={<PendingApplications />} />
//       <Route path="/historico-de-solicitudes" element={<HistorialRequest />} />

//       <Route path="/mis-solicitudes" element={<MyApplications />} />
//       <Route path="/buscar-cursos" element={<SearchCourses />} />

//       <Route
//         path="/informacion-de-la-solicitud/:idSolicitud"
//         element={<ApplicationInformation />}
//       />
//       <Route
//         path="/informacion-del-curso/:idCurso"
//         element={<CourseInformation />}
//       />
//       <Route
//         path="/informacion-de-mi-curso/:idCurso"
//         element={<CourseInformationMyApplication />}
//       />
//       <Route path="/registrar-curso" element={<RegisterCourse />} />
//       <Route path="/cambiar-usuario" element={<ChangeUser />} />
//       <Route path="/*" element={<Navigate to="/" />} />
//     </Routes>
//   );
// };
// export default PrivateRoutes;
