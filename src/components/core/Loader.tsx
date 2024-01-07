import '../../scss/loader.scss';

const Loader = () => {
  return (
    <div className="h-screen w-screen bg-indigo-950 flex justify-center items-center">
      <div className="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Loader;
