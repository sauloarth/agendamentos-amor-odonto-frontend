const AuthLayout = ({ title, subtitle, children }) => {
  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="hidden md:flex flex-col justify-between bg-pine-700 text-canvas p-12">
        <span className="font-display text-2xl">Amor Odonto</span>
        <div>
          <h1 className="font-display text-4xl leading-tight mb-4">{title}</h1>
          <p className="text-pine-100/80 max-w-sm">{subtitle}</p>
        </div>
        <span className="text-sm text-pine-100/60">Sua consulta, sem fila de espera.</span>
      </div>
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
