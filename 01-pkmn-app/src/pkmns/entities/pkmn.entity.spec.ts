import { Pkmn } from './pkmn.entity'

describe('PkmnEntity', () => {
  it('should create a pkmn instante', () => {
    const pkmn = new Pkmn()
    expect(pkmn).toBeInstanceOf(Pkmn)
  })

  it('should have the correct properties', () => {
    const pkmn = new Pkmn()
    pkmn.id = 1
    pkmn.name = 'bulbasaur'
    pkmn.type = 'grass'
    pkmn.hp = 45
    pkmn.sprites = ['sprite1.png', 'sprite2.png']
    expect(JSON.stringify(pkmn)).toEqual(
      '{"id":1,"name":"bulbasaur","type":"grass","hp":45,"sprites":["sprite1.png","sprite2.png"]}',
    )
  })
})
