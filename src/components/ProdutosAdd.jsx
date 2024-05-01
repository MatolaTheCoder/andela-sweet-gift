import React from 'react';

export default function ProdutosAdd() {
  return (
    <>
      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <div className="card card-primary">
                <form method="post" action="" enctype="multipart/form-data">
                  <div className="card-body">
                    <div className="row">
                      <div className="form-group col-md-6">
                        <label>Nome do Produto<span style={{ color: 'red' }}> *</span> </label>
                        <input type="text" className="form-control" name="name" value={''} required placeholder="Nome do produto" />
                        <div style={{ color: 'red' }}></div>
                      </div>
                      <div className="form-group col-md-6">
                        <label>Last Name<span style={{ color: 'red' }}> *</span></label>
                        <input type="text" className="form-control" name="last_name" value={''} required placeholder="Last Name" />
                        <div style={{ color: 'red' }}></div>
                      </div>
                    </div>
                    <hr />
                    <div className="form-group">
                      <label>Email<span style={{ color: 'red' }}> *</span></label>
                      <input type="email" className="form-control" name="email" value={''} required placeholder="Enter email" />
                      <div style={{ color: 'red' }}></div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="password">Password<span style={{ color: 'red' }}> *</span></label>
                      <input type="password" className="form-control" name="password" required placeholder="Password" />
                      <div style={{ color: 'red' }}></div>
                    </div>
                  </div>
                  <div className="card-footer">
                    <button type="submit" className="btn btn-primary">Submit</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
