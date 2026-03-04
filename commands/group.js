    const args = text.split(/\s+/).slice(1)
    
    let target
    if (message.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
        target = message.message.extendedTextMessage.contextInfo.participant
    } else if (args[0]) {
        target = args[0].replace('@', '') + '@s.whatsapp.net'
    } else {
        const warnKeys = Object.keys(warnStorage).filter(key => key.startsWith(groupId + '_'))
        const count = warnKeys.length
        
        return await client.sendMessage(groupId, {
            text: `📊 *Warns:* ${count} utilisateur(s)\n\nUsage: .resetwarns @user`
        })
    }
    
    const warnKey = `${groupId}_${target}`
    if (warnStorage[warnKey]) {
        delete warnStorage[warnKey]
        await client.sendMessage(groupId, {
            text: `✅ Warns réinitialisés pour @${target.split('@')[0]}`
        })
    } else {
        await client.sendMessage(groupId, {
            text: `ℹ️ Aucun warn pour @${target.split('@')[0]}`
        })
    }
}

export async function checkwarns(client, message) {
    const groupId = message.key.remoteJid
    const warnKeys = Object.keys(warnStorage).filter(key => key.startsWith(groupId + '_'))
    
    if (warnKeys.length === 0) {
        return await client.sendMessage(groupId, {
            text: '✅ Aucun warn dans ce groupe.'
        })
    }
    
    let report = '📊 *Liste des Warns*\n\n'
    
    for (const key of warnKeys) {
        const userId = key.split('_')[1]
        const warnCount = warnStorage[key]
        report += `@${userId.split('@')[0]} : ${warnCount}/3 warns\n`
    }
    
    await client.sendMessage(groupId, { text: report })
}

export async function kick(client, message) {
    const groupId = message.key.remoteJid
    if (!groupId.includes('@g.us')) return
    
    try {
        const text = message.message?.extendedTextMessage?.text || message.message?.conversation || ''
        const args = text.split(/\s+/).slice(1)
        let target
        
        if (message.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
            target = message.message.extendedTextMessage.contextInfo.participant
        } else if (args[0]) {
            target = args[0].replace('@', '') + '@s.whatsapp.net'
        } else {
            return await client.sendMessage(groupId, { text: '❌ Réponds à un message ou mentionne.' })
        }
        
        await client.groupParticipantsUpdate(groupId, [target], 'remove')
        await client.sendMessage(groupId, { text: `🚫 @${target.split('@')[0]} exclu.` })
    } catch (error) {
        await client.sendMessage(groupId, { text: '❌ Erreur' })
    }
}

export async function kickall(client, message) {
    const groupId = message.key.remoteJid
    if (!groupId.includes('@g.us')) return
    
    try {
        const metadata = await client.groupMetadata(groupId)
        const targets = metadata.participants.filter(p => !p.admin).map(p => p.id)
        
        await client.sendMessage(groupId, { text: '⚡ Digital Crew - Purge...' })
        
        for (const target of targets) {
            try {
                await client.groupParticipantsUpdate(groupId, [target], 'remove')
            } catch {}
        }
        
        await client.sendMessage(groupId, { text: '✅ Purge terminée.' })
    } catch (error) {
        await client.sendMessage(groupId, { text: '❌ Erreur' })
    }
}

export async function kickall2(client, message) {
    const groupId = message.key.remoteJid
    if (!groupId.includes('@g.us')) return
    
    try {
        const metadata = await client.groupMetadata(groupId)
        const targets = metadata.participants.filter(p => !p.admin).map(p => p.id)
        
        await client.sendMessage(groupId, { text: '⚡ Digital Crew - One Shot...' })
        await client.groupParticipantsUpdate(groupId, targets, 'remove')
        await client.sendMessage(groupId, { text: '✅ Tous exclus.' })
    } catch (error) {
        await client.sendMessage(groupId, { text: '❌ Erreur' })
    }
}

export async function promote(client, message) {
    const groupId = message.key.remoteJid
    if (!groupId.includes('@g.us')) return
    
    try {
        const text = message.message?.extendedTextMessage?.text || message.message?.conversation || ''
        const args = text.split(/\s+/).slice(1)
        let target
        
        if (message.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
            target = message.message.extendedTextMessage.contextInfo.participant
        } else if (args[0]) {
            target = args[0].replace('@', '') + '@s.whatsapp.net'
        } else {
            return await client.sendMessage(groupId, { text: '❌ Réponds à un message ou mentionne.' })
        }
        
        await client.groupParticipantsUpdate(groupId, [target], 'promote')
        await client.sendMessage(groupId, { text: `👑 @${target.split('@')[0]} promu admin.` })
    } catch (error) {
        await client.sendMessage(groupId, { text: '❌ Erreur' })
    }
}

export async function demote(client, message) {
    const groupId = message.key.remoteJid
    if (!groupId.includes('@g.us')) return
    
    try {
        const text = message.message?.extendedTextMessage?.text || message.message?.conversation || ''
        const args = text.split(/\s+/).slice(1)
        let target
        
        if (message.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
            target = message.message.extendedTextMessage.contextInfo.participant
        } else if (args[0]) {
            target = args[0].replace('@', '') + '@s.whatsapp.net'
        } else {
            return await client.sendMessage(groupId, { text: '❌ Réponds à un message ou mentionne.' })
        }
        
        await client.groupParticipantsUpdate(groupId, [target], 'demote')
        await client.sendMessage(groupId, { text: `📉 @${target.split('@')[0]} retiré admin.` })
    } catch (error) {
        await client.sendMessage(groupId, { text: '❌ Erreur' })
    }
}

export async function gclink(client, message) {
    const groupId = message.key.remoteJid
    if (!groupId.includes('@g.us')) return
    
    try {
        const code = await client.groupInviteCode(groupId)
        await client.sendMessage(groupId, { 
            text: `🔗 Lien du groupe:\nhttps://chat.whatsapp.com/${code}` 
        })
    } catch (error) {
        await client.sendMessage(groupId, { text: '❌ Impossible de générer le lien.' })
    }
}

export async function join(client, message) {
    try {
        const text = message.message?.conversation || message.message?.extendedTextMessage?.text || ''
        const match = text.match(/chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/i)
        if (match) {
            await client.groupAcceptInvite(match[1])
        }
    } catch {}
}

export default { 
    kick, 
    kickall, 
    kickall2,
    promote, 
    demote, 
    gclink, 
    join,
    antilink, 
    linkDetection,
    resetwarns,
    checkwarns    const args = text.split(/\s+/).slice(1)
    
    let target
    if (message.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
        target = message.message.extendedTextMessage.contextInfo.participant
    } else if (args[0]) {
        target = args[0].replace('@', '') + '@s.whatsapp.net'
    } else {
        const warnKeys = Object.keys(warnStorage).filter(key => key.startsWith(groupId + '_'))
        const count = warnKeys.length
        
        return await client.sendMessage(groupId, {
            text: `📊 *Warns:* ${count} utilisateur(s)\n\nUsage: .resetwarns @user`
        })
    }
    
    const warnKey = `${groupId}_${target}`
    if (warnStorage[warnKey]) {
        delete warnStorage[warnKey]
        await client.sendMessage(groupId, {
            text: `✅ Warns réinitialisés pour @${target.split('@')[0]}`
        })
    } else {
        await client.sendMessage(groupId, {
            text: `ℹ️ Aucun warn pour @${target.split('@')[0]}`
        })
    }
}

export async function checkwarns(client, message) {
    const groupId = message.key.remoteJid
    const warnKeys = Object.keys(warnStorage).filter(key => key.startsWith(groupId + '_'))
    
    if (warnKeys.length === 0) {
        return await client.sendMessage(groupId, {
            text: '✅ Aucun warn dans ce groupe.'
        })
    }
    
    let report = '📊 *Liste des Warns*\n\n'
    
    for (const key of warnKeys) {
        const userId = key.split('_')[1]
        const warnCount = warnStorage[key]
        report += `@${userId.split('@')[0]} : ${warnCount}/3 warns\n`
    }
    
    await client.sendMessage(groupId, { text: report })
}

export async function kick(client, message) {
    const groupId = message.key.remoteJid
    if (!groupId.includes('@g.us')) return
    
    try {
        const text = message.message?.extendedTextMessage?.text || message.message?.conversation || ''
        const args = text.split(/\s+/).slice(1)
        let target
        
        if (message.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
            target = message.message.extendedTextMessage.contextInfo.participant
        } else if (args[0]) {
            target = args[0].replace('@', '') + '@s.whatsapp.net'
        } else {
            return await client.sendMessage(groupId, { text: '❌ Réponds à un message ou mentionne.' })
        }
        
        await client.groupParticipantsUpdate(groupId, [target], 'remove')
        await client.sendMessage(groupId, { text: `🚫 @${target.split('@')[0]} exclu.` })
    } catch (error) {
        await client.sendMessage(groupId, { text: '❌ Erreur' })
    }
}

export async function kickall(client, message) {
    const groupId = message.key.remoteJid
    if (!groupId.includes('@g.us')) return
    
    try {
        const metadata = await client.groupMetadata(groupId)
        const targets = metadata.participants.filter(p => !p.admin).map(p => p.id)
        
        await client.sendMessage(groupId, { text: '⚡ Digital Crew - Purge...' })
        
        for (const target of targets) {
            try {
                await client.groupParticipantsUpdate(groupId, [target], 'remove')
            } catch {}
        }
        
        await client.sendMessage(groupId, { text: '✅ Purge terminée.' })
    } catch (error) {
        await client.sendMessage(groupId, { text: '❌ Erreur' })
    }
}

export async function kickall2(client, message) {
    const groupId = message.key.remoteJid
    if (!groupId.includes('@g.us')) return
    
    try {
        const metadata = await client.groupMetadata(groupId)
        const targets = metadata.participants.filter(p => !p.admin).map(p => p.id)
        
        await client.sendMessage(groupId, { text: '⚡ Digital Crew - One Shot...' })
        await client.groupParticipantsUpdate(groupId, targets, 'remove')
        await client.sendMessage(groupId, { text: '✅ Tous exclus.' })
    } catch (error) {
        await client.sendMessage(groupId, { text: '❌ Erreur' })
    }
}

export async function promote(client, message) {
    const groupId = message.key.remoteJid
    if (!groupId.includes('@g.us')) return
    
    try {
        const text = message.message?.extendedTextMessage?.text || message.message?.conversation || ''
        const args = text.split(/\s+/).slice(1)
        let target
        
        if (message.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
            target = message.message.extendedTextMessage.contextInfo.participant
        } else if (args[0]) {
            target = args[0].replace('@', '') + '@s.whatsapp.net'
        } else {
            return await client.sendMessage(groupId, { text: '❌ Réponds à un message ou mentionne.' })
        }
        
        await client.groupParticipantsUpdate(groupId, [target], 'promote')
        await client.sendMessage(groupId, { text: `👑 @${target.split('@')[0]} promu admin.` })
    } catch (error) {
        await client.sendMessage(groupId, { text: '❌ Erreur' })
    }
}

export async function demote(client, message) {
    const groupId = message.key.remoteJid
    if (!groupId.includes('@g.us')) return
    
    try {
        const text = message.message?.extendedTextMessage?.text || message.message?.conversation || ''
        const args = text.split(/\s+/).slice(1)
        let target
        
        if (message.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
            target = message.message.extendedTextMessage.contextInfo.participant
        } else if (args[0]) {
            target = args[0].replace('@', '') + '@s.whatsapp.net'
        } else {
            return await client.sendMessage(groupId, { text: '❌ Réponds à un message ou mentionne.' })
        }
        
        await client.groupParticipantsUpdate(groupId, [target], 'demote')
        await client.sendMessage(groupId, { text: `📉 @${target.split('@')[0]} retiré admin.` })
    } catch (error) {
        await client.sendMessage(groupId, { text: '❌ Erreur' })
    }
}

export async function gclink(client, message) {
    const groupId = message.key.remoteJid
    if (!groupId.includes('@g.us')) return
    
    try {
        const code = await client.groupInviteCode(groupId)
        await client.sendMessage(groupId, { 
            text: `🔗 Lien du groupe:\nhttps://chat.whatsapp.com/${code}` 
        })
    } catch (error) {
        await client.sendMessage(groupId, { text: '❌ Impossible de générer le lien.' })
    }
}

export async function join(client, message) {
    try {
        const text = message.message?.conversation || message.message?.extendedTextMessage?.text || ''
        const match = text.match(/chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/i)
        if (match) {
            await client.groupAcceptInvite(match[1])
        }
    } catch {}
}

export default { 
    kick, 
    kickall, 
    kickall2,
    promote, 
    demote, 
    gclink, 
    join,
    antilink, 
    linkDetection,
    resetwarns,
    checkwarns