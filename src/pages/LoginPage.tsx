import React, { FC, Fragment, useEffect } from 'react'
import { useNavigate, RouteComponentProps } from '@reach/router'
import { GoogleLoginButton } from 'react-social-login-buttons'
import { Layout, Button, Divider, Alert } from 'antd'

import { log } from '../utils'
import { useAuth } from '../contexts/AuthContext'
import logo from '../assets/logo.png'
import intro from '../assets/intro.png'

const { Header, Content, Footer } = Layout

const LoginPage: FC<RouteComponentProps> = () => {
  const { loginWithGoogle, user, userDb, loading } = useAuth()

  const navigate = useNavigate()

  useEffect(() => {
    log('Login Effect')
    log({ user })
    if (user && !userDb) {
      navigate('/onboard')

      return
    }

    if (user) {
      navigate('/')
    }
  }, [user, navigate, userDb])

  return (
    <Fragment>
      {loading && (
        <h3 className="grey">Estamos verificando se você já está logado</h3>
      )}
      {!loading && (
        <Layout>
          <Header>
            <div className="flex justify-center">
              <div>
                <img
                  src={logo}
                  alt="Alt Zap"
                  className="pa2"
                  style={{ maxHeight: '55px' }}
                />
              </div>
            </div>
          </Header>
          <Content className="flex justify-center">
            <div className="w-100 w-60-l">
              <div className="flex flex-column">
                <span className="black f3 f1-l fw2 ph2 pt3 mt2 mb3 pb2 pa4 tc">
                  Compartilhe seus produtos e receba pedidos pelo Whatsapp
                </span>
                <div className="flex justify-center">
                  <div className="bg-light-gray br4 shadow-1 pv1 ph2 fw3">
                    <span className="b" style={{ color: '#1890FF' }}>
                      GRATUITAMENTE
                    </span>
                  </div>
                </div>
                <div className="flex justify-center pt3 mt3">
                  <img
                    className="w-80 w-50-l h-auto"
                    src={intro}
                    alt="Alt Zap"
                  />
                </div>
                <div className="flex mt4 mb1 pl2">
                  <span className="f4 fw3">Feito para:</span>
                </div>
                <div className="flex flex-wrap ml1">
                  {[
                    'HAMBURGUERIAS',
                    'LOJAS DE ROUPA',
                    'PIZZARIAS',
                    'DOCERIAS',
                    'O QUE VOCÊ QUISER',
                  ].map((text, i) => (
                    <span
                      key={i}
                      style={{
                        color: i === 4 ? '#1890FF' : '#000',
                        whiteSpace: 'nowrap',
                      }}
                      className="bg-light-gray shadow-1 pv1 ph2 b ma2 mh1 br4 f7"
                    >
                      {text}
                    </span>
                  ))}
                </div>
                <div className="flex flex-column items-center mt4">
                  <span className="f3 fw3 mb3">Como funciona</span>
                  <ol>
                    <li>
                      Você configura seu <b>catálogo de produtos</b> no nosso
                      sistema. Dá pra colocar nome, imagem e descrição.
                    </li>
                    <Divider />
                    <li>
                      Você configura os <b>meios de pagamento</b> que você
                      aceita, podendo fornecer informações para pagamento
                      (PicPay, Nuconta...).
                    </li>
                    <Divider />
                    <li>
                      Após isso, iremos{' '}
                      <b>gerar um link único para o seu negócio.</b> Se parece
                      com algo assim: <i>alt-zap.vercel.app/bar-do-lucis</i>.
                    </li>
                    <Divider />
                    <li>
                      Você compartilha esse link com seus clientes nas redes
                      sociais, e eles poderão{' '}
                      <b> selecionar os produtos e o endereço de entrega.</b>
                    </li>
                    <Divider />
                    <li>
                      No final, encaminhamos o cliente para o Whatsapp{' '}
                      <b>com o pedido pronto para enviar até você.</b>
                    </li>
                  </ol>
                </div>
                <div className="flex flex-column items-center mt4 ph1">
                  <span className="f3 fw3 mb3">Funcionalidades</span>
                  <ul>
                    <li>
                      Preenchimento automático de endereço por CEP ou
                      localização
                    </li>
                    <li>
                      Produtos cadastrados podem ser desabilitados
                      temporariamente
                    </li>
                    <li>Meios de Pagamento com descrição e imagem</li>
                  </ul>
                  <Alert
                    type="info"
                    className="ma2"
                    message={
                      <Fragment>
                        {`O AltZap está em fase beta e futuramente traremos várias
                    outras funcionalidades. Caso você se interesse em
                    desenvolver, visite nosso `}
                        <a
                          href="https://github.com/lucis/alt-zap"
                          rel="noopener"
                        >
                          Github
                        </a>
                      </Fragment>
                    }
                  />
                </div>
                <div className="flex flex-column items-center mt4">
                  <Button
                    type="primary"
                    size="large"
                    className="br2 pt2 mt2"
                    onClick={() => navigate('/altburguer-cg')}
                  >
                    Veja um modelo!
                  </Button>
                </div>
                <div className="flex justify-center tc mt4">
                  <span className="f3 fw3 mb3">
                    Crie sua página gratuitamente:
                  </span>
                </div>
                <div className="flex justify-center">
                  <GoogleLoginButton
                    text="Entre com o Google"
                    style={{ maxWidth: '300px' }}
                    onClick={() => loginWithGoogle()}
                  />
                </div>
              </div>
            </div>
          </Content>
          <Footer className="tc">
            Alt Zap ©2020 -{' '}
            <a href="https://github.com/lucis/alt-zap">Estamos no Github</a>
          </Footer>
        </Layout>
      )}
    </Fragment>
  )
}

export default LoginPage
