// API Handshake Entry Point with Security Key Check
app.get('/fetch-runtime', (req, res) => {
    // Check if the request contains your secret header key
    const secretKey = req.headers['x-access-key'];
    
    // Change "MySecretPassword123" to any password you want!
    if (!secretKey || secretKey !== "fukligma82725252***bbbsall177##") {
        return res.status(403).send("Error: Access Denied. You cannot view this source code.");
    }

    try {
        const scrambledOutput = luamin.Beautify(mySecretSourceCode, {
            RenameVariables: true,
            RenameGlobals: false,
            SolveMath: true
        });
        res.set('Content-Type', 'text/plain');
        res.send(scrambledOutput);
    } catch (e) {
        res.status(500).send("-- Server execution optimization failure.");
    }
});

const express = require('express');
const cors = require('cors');
const luamin = require('lua-format'); // Handles structural protection
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ==========================================================
// Your Source Code: Hidden safely on your cloud ecosystem.
// ==========================================================
const mySecretSourceCode = `
-- ==========================================
-- 1. Anti-Cheat Handlers & UI Interceptors
-- ==========================================
local Original_GMHelper_onAppActionTrigger = GMHelper.onAppActionTrigger

GMHelper.onAppActionTrigger = function(type, params)
    if type(params) == "table" then
        for _, v in pairs(params) do
            if type(v) == "string" and string.find(v, "16", 1, true) then
                return
            end
        end
    end
    return Original_GMHelper_onAppActionTrigger(type, params)
end

local original_io_open = io.open
io.open = function(path, mode)
    if path and tostring(path):find("proc/self/maps") then
        return nil, "No such file or directory"
    end
    return original_io_open(path, mode)
end

-- ==========================================
-- 2. Core Layout & Life Cycle Handlers
-- ==========================================
local UIGMControlPanel = require("engine_client.ui.layout.GUIGMControlPanel")

function UIGMControlPanel:show()
    self.super.show(self)
    if UIHelper.showOpenAnim then UIHelper.showOpenAnim(self) end
end

function UIGMControlPanel:hide()
    self.super.hide(self)
end

function Game:init()
    self.CGame = CGame.Instance()
    self.GameType = self.CGame:getGameType()
    self.EnableIndie = self.CGame:isEnableIndie(true)
    self.Blockman = Blockman.Instance()
    self.World = self.Blockman:getWorld()
    self.LowerDevice = self.CGame:isLowerDevice()
    EngineWorld:setWorld(self.World)
end

function Game:isOpenGM()
    return isClient
end

-- ==========================================
-- 3. Menu Settings Framework
-- ==========================================
local Settings = {}
GMSetting = {}
local states = {} 

local function isGMOpen(userId)
    if isClient then
        return true
    end
    return TableUtil.include(AdminIds, tostring(userId))
end

function GMSetting:addTab(tab_name, index)
    for _, setting in pairs(Settings) do
        if setting.name == tab_name then
            setting.items = {}
            return
        end
    end
    index = index or #Settings + 1
    table.insert(Settings, index, { name = tab_name, items = {} })
end

function GMSetting:addItem(tab_name, item_name, func_name, ...)
    local settings
    for _, group in pairs(Settings) do
        if group.name == tab_name then
            settings = group
        end
    end
    if not settings then
        GMSetting:addTab(tab_name)
        GMSetting:addItem(tab_name, item_name, func_name, ...)
        return
    end
    table.insert(settings.items, { name = item_name, func = func_name, params = { ... } })
end

function GMSetting:getSettings()
    return Settings
end

-- ==========================================
-- 4. Shared Toggle Engine
-- ==========================================
local function toggleHelper(self, hackName, enableFunc, disableFunc)
    self[hackName .. "Active"] = not (self[hackName .. "Active"] or false)
    if self[hackName .. "Active"] then
        enableFunc(self)
        UIHelper.showToast("^00FF00" .. hackName .. ": On") 
    else
        disableFunc(self)
        UIHelper.showToast("^FF0000" .. hackName .. ": Off") 
    end
end

-- ==========================================
-- 5. Persistent Background Indicators (HUD)
-- ==========================================
function Fps()
    local DATS = GUIManager:createGUIWindow(GUIType.StaticText, "GUIRoot-Fps")
    DATS:SetVisible(true)
    DATS:SetWidth({ 0, 120 })
    DATS:SetHeight({ 0, 40 })
    DATS:SetXPosition({ 0, 15 })
    DATS:SetYPosition({ 0, 680 })
    DATS:SetBordered(true)
    GUISystem.Instance():GetRootWindow():AddChildWindow(DATS)

    LuaTimer:scheduleTimer(function()
        local fps = Root.Instance():getFPS()
        local ping = ClientNetwork.Instance():getRaknetPing()
        DATS:SetText("Fps: " .. fps .. " |\\nPing: " .. ping)
    end, 100, -1)
end
Fps()

function pos()
    local POS = GUIManager:createGUIWindow(GUIType.StaticText, "GUIRoot-Pose")
    POS:SetVisible(true)
    POS:SetWidth({0, 150})
    POS:SetHeight({0, 20})
    POS:SetXPosition({0, 15})
    POS:SetYPosition({0, 650})
    POS:SetBordered(true)
    GUISystem.Instance():GetRootWindow():AddChildWindow(POS)

    LuaTimer:scheduleTimer(function()
        local me = PlayerManager:getClientPlayer()
        if me and me.Player then
            local myPos = me.Player:getPosition()
            POS:SetText(string.format("Pos: %.2f, %.2f, %.2f", myPos.x, myPos.y, myPos.z))
        end
    end, 100, -1)
end
pos()

function PlayerCounter()
    local counterWindow = GUIManager:createGUIWindow(GUIType.StaticText, "GUIRoot-PlayerCounter")
    counterWindow:SetVisible(true)
    counterWindow:SetWidth({0, 100})
    counterWindow:SetHeight({0, 20})
    counterWindow:SetXPosition({0, 15})
    counterWindow:SetYPosition({0, 620})
    counterWindow:SetBordered(true)
    GUISystem.Instance():GetRootWindow():AddChildWindow(counterWindow)

    LuaTimer:scheduleTimer(function()
        local playerCount = 0
        for _ in pairs(PlayerManager:getPlayers()) do
            playerCount = playerCount + 1
        end
        counterWindow:SetText("Players: " .. playerCount)
    end, 100, -1)
end
PlayerCounter()

-- ==========================================
-- 6. Helper Action & Modification Methods
-- ==========================================
GMHelper = {}
GMHelper.savedPositions = {}

function GMHelper:enableGM()
    if GUIGMControlPanel then return end
    GUIGMControlPanel = UIHelper.newEngineGUILayout("GUIGMControlPanel", "GMControlPanel.json")
    GUIGMControlPanel:hide()
    GUIGMMain = UIHelper.newEngineGUILayout("GUIGMMain", "GMMain.json")
    GUIGMMain:show()
    local isOpenEventDialog = ClientHelper.getBoolForKey("g1008_isOpenEventDialog", false)
    GUIGMMain:changeOpenEventDialog(isOpenEventDialog)
    if GMSetting.addItemGMItems then
        GMSetting:addItemGMItems()
        GMSetting.addItemGMItems = nil
    end
end

function GMHelper:TB() UIHelper.showToast("Trigger bot activated") end

function GMHelper:roomsteal() 
    local player = PlayerManager:getClientPlayer()
    local userId = CGame.Instance():getPlatformUserId()
    if player then
        player:sendPacket({ data = userId, pid = 'exchangeOwner' })
        UIHelper.showToast("^00FF00Host Claim Sent!")
    end
end

function GMHelper:saveTP()
    local player = PlayerManager:getClientPlayer()
    if player and player.Player then
        self.savedPositions.saveTP = player.Player:getPosition()
        UIHelper.showToast("^00FF00Position Saved!")
    end
end

function GMHelper:backTP()
    if self.savedPositions.saveTP then
        local player = PlayerManager:getClientPlayer()
        if player and player.Player then
            player.Player:setPosition(self.savedPositions.saveTP)
            UIHelper.showToast("^00FF00Teleported Back!")
        end
    else
        UIHelper.showToast("^FF0000No saved position!")
    end
end

local devflytog = false
function GMHelper:devfly()
    devflytog = not devflytog
    local clientPlayer = PlayerManager:getClientPlayer()
    if not clientPlayer or not clientPlayer.Player then return end
    local player = clientPlayer.Player

    if not devflytog then
        player:setAllowFlying(false)
        player:setFlying(false)
        player:setSpeedAdditionLevel(15)
        player:moveEntity(VectorUtil.newVector3(0, -2, 0)) 
        UIHelper.showToast("^FF0000Fly Off")
        return
    end
    player:setAllowFlying(true)
    player:setFlying(true)
    player:setSpeedAdditionLevel(50000)
    player:moveEntity(VectorUtil.newVector3(0, 0.5, 0))
    UIHelper.showToast("^00FF00Fly On")
end

function GMHelper:toggleSpeed()
    toggleHelper(self, "Speed", function()
        PlayerManager:getClientPlayer().Player:setSpeedAdditionLevel(15000)
    end, function()
        PlayerManager:getClientPlayer().Player:setSpeedAdditionLevel(15)
    end)
end

function GMHelper:toggleHighJump()
    toggleHelper(self, "HighJump", function()
        PlayerManager:getClientPlayer().Player:setFloatProperty("JumpHeight", 1)
    end, function()
        PlayerManager:getClientPlayer().Player:setFloatProperty("JumpHeight", 0.4)
    end)
end

function GMHelper:toggleInfJump()
    toggleHelper(self, "UnlimitedJump", function()
        ClientHelper.putBoolPrefs("EnableDoubleJumps", true)
    end, function()
        ClientHelper.putBoolPrefs("EnableDoubleJumps", false)
    end)
end

function GMHelper:toggleJetPack()
    toggleHelper(self, "JetPack", function()
        self.jetpackTimer = LuaTimer:scheduleTimer(function()
            local player = PlayerManager:getClientPlayer()
            if not player or not player.Player then return end
            local yaw, pitch = player.Player:getYaw(), player.Player:getPitch()
            local yawRad, pitchRad = math.rad(yaw), math.rad(pitch)
            local speed = 2.1
            local x = -speed * math.cos(pitchRad) * math.sin(yawRad)
            local y = -speed * math.sin(pitchRad)
            local z = speed * math.cos(pitchRad) * math.cos(yawRad)
            player.Player:setVelocity(VectorUtil.newVector3(x, y, z))
        end, 15, -1)
    end, function()
        if self.jetpackTimer then
            LuaTimer:cancel(self.jetpackTimer)
            self.jetpackTimer = nil
        end
    end)
end

local noFallDamageTimer = nil
local previousY = nil
function GMHelper:NoFaldmg()
    toggleHelper(self, "NoFallDamage", function()
        local FALL_TOLERANCE = 1.5
        noFallDamageTimer = LuaTimer:scheduleTimer(function()
            local clientPlayer = PlayerManager:getClientPlayer().Player
            if not clientPlayer then return end
            local currentY = clientPlayer:getPosition().y
            if not previousY then previousY = currentY end
            
            if currentY < previousY - FALL_TOLERANCE then
                clientPlayer.noClip = true
            else
                clientPlayer.noClip = false
            end
            previousY = currentY
        end, 100, -1)
    end, function()
        if noFallDamageTimer then
            LuaTimer:cancel(noFallDamageTimer)
            noFallDamageTimer = nil
        end
        local p = PlayerManager:getClientPlayer().Player
        if p then p.noClip = false end
        previousY = nil
    end)
end

function GMHelper:toggleNoClip()
    toggleHelper(self, "NoClip", function()
        local p = PlayerManager:getClientPlayer().Player
        if p then p:setNoClip(true); p:setFlying(true) end
    end, function()
        local p = PlayerManager:getClientPlayer().Player
        if p then p:setNoClip(false); p:setFlying(false) end
    end)
end

function GMHelper:toggleBlink()
    toggleHelper(self, "Blink", function()
        ClientHelper.putBoolPrefs("SyncClientPositionToServer", false)
    end, function()
        ClientHelper.putBoolPrefs("SyncClientPositionToServer", true)
    end)
end

function GMHelper:toggleAntiKnockback()
    toggleHelper(self, "AntiKnockBack", function()
        states.lastHealth = nil
        states.lastPosition = nil
        states.AntiKnockBackTimer = LuaTimer:scheduleTimer(function()
            local me = PlayerManager:getClientPlayer()
            if not me or not me.Player then return end
            local currentHealth = me.Player:getHealth()
            local currentPosition = me.Player:getPosition()
            if states.lastHealth and currentHealth < states.lastHealth and states.lastPosition then
                me.Player:setPosition(states.lastPosition)
            end
            states.lastHealth = currentHealth
            states.lastPosition = currentPosition
        end, 10, -1)
    end, function()
        if states.AntiKnockBackTimer then LuaTimer:cancel(states.AntiKnockBackTimer) end
        states.lastHealth = nil
        states.lastPosition = nil
    end)
end

function GMHelper:toggleScaffold()
    toggleHelper(self, "Scaffold", function()
        states.ScaffoldTimer = LuaTimer:scheduleTimer(function()
            local p = PlayerManager:getClientPlayer()
            if not p then return end
            local pos = p:getPosition()
            local function place(x, y, z) EngineWorld:setBlock(VectorUtil.newVector3(x, y, z), 5) end
            place(pos.x, pos.y - 2, pos.z)
            place(pos.x, pos.y - 2, pos.z + 1)
            place(pos.x, pos.y - 2, pos.z - 1)
            place(pos.x + 1, pos.y - 2, pos.z)
            place(pos.x - 1, pos.y - 2, pos.z)
        end, 100, -1)
    end, function()
        if states.ScaffoldTimer then LuaTimer:cancel(states.ScaffoldTimer) end
    end)
end

function GMHelper:toggleHitBox()
    toggleHelper(self, "HitBox", function()
        for _, player in pairs(PlayerManager:getPlayers()) do
            if player ~= PlayerManager:getClientPlayer() and player.Player then
                local e = player.Player
                e.height = 2.5; e.width = 3; e.length = 3
            end
        end
    end, function()
        for _, player in pairs(PlayerManager:getPlayers()) do
            if player ~= PlayerManager:getClientPlayer() and player.Player then
                local e = player.Player
                e.height = 1.8; e.width = 0.6; e.length = 0.6
            end
        end
    end)
end

local KillAuraTimer = nil
function GMHelper:toggleKillAura()
    toggleHelper(self, "KillAura", function()
        if KillAuraTimer then LuaTimer:cancel(KillAuraTimer) end
        KillAuraTimer = LuaTimer:scheduleTimer(function()
            local me = PlayerManager:getClientPlayer()
            if not me or not me.Player then return end
            local myPos = me.Player:getPosition()
            local myTeamId = me:getTeamId()
            
            for _, player in pairs(PlayerManager:getPlayers()) do
                if player ~= me and player.Player and player:getTeamId() ~= myTeamId then
                    local playerPos = player.Player:getPosition()
                    if MathUtil:distanceSquare2d(playerPos, myPos) <= 75 then
                        player.Player.width = 5
                        player.Player.length = 5
                        player.Player.height = 5
                        CGame.Instance():handleTouchClick(800, 360)
                    end
                end
            end
        end, 50, -1)
    end, function()
        if KillAuraTimer then LuaTimer:cancel(KillAuraTimer) end
        KillAuraTimer = nil
        for _, player in pairs(PlayerManager:getPlayers()) do
            if player.Player then
                player.Player.width = 0.6; player.Player.length = 0.6; player.Player.height = 1.8
            end
        end
    end)
end

function GMHelper:toggleUnlimitedGcube()
    toggleHelper(self, "UnlimitedGcube", function()
        local wallet = Game:getPlayer():getWallet()
        if wallet then
            wallet.m_diamondBlues = 999999999
            wallet.m_diamondGolds = 999999999
            wallet:setGolds(999999999)
        end
    end, function()
        local wallet = Game:getPlayer():getWallet()
        if wallet then
            wallet.m_diamondBlues = 0
            wallet.m_diamondGolds = 0
            wallet:setGolds(0)
        end
    end)
end

function GMHelper:toggleBoostFPS()
    toggleHelper(self, "BoostFPS", function()
        ClientHelper.putIntPrefs("GraphicsQuality", 0)
        ClientHelper.putBoolPrefs("EnableParticles", false)
        ClientHelper.putBoolPrefs("EnableWeather", false)
        ClientHelper.putBoolPrefs("EnableShadows", false)
    end, function()
        ClientHelper.putIntPrefs("GraphicsQuality", 2)
        ClientHelper.putBoolPrefs("EnableParticles", true)
        ClientHelper.putBoolPrefs("EnableWeather", true)
        ClientHelper.putBoolPrefs("EnableShadows", true)
    end)
end

function GMHelper:openInput(paramTexts, callBack)
    if type(paramTexts) ~= "table" then return end
    for _, paramText in pairs(paramTexts) do
        if type(paramText) ~= "string" then return end
    end
    GUIGMControlPanel:openInput(paramTexts, callBack)
end

function GMHelper:callCommand(name, ...)
    local func = self[name]
    if type(func) == "function" then
        func(self, ...)
    end
    local data = { name = name, params = { ... } }
    table.remove(data.params)
end

-- ==========================================
-- 7. Menu Item Initializations
-- ==========================================
GMSetting:addTab("Hack")
GMSetting:addItem("Hack", "Gun_Trig_Bot", "TB")
GMSetting:addItem("Hack", "Room_host_steal", "roomsteal")
GMSetting:addItem("Hack", "DevFly", "devfly")
GMSetting:addItem("Hack", "No Fall Dmg", "NoFaldmg")
GMSetting:addItem("Hack", "Speed Multiplier", "toggleSpeed")
GMSetting:addItem("Hack", "High Jump Profile", "toggleHighJump")
GMSetting:addItem("Hack", "Infinite Jumps", "toggleInfJump")
GMSetting:addItem("Hack", "JetPack Engine", "toggleJetPack")
GMSetting:addItem("Hack", "NoClip Override", "toggleNoClip")
GMSetting:addItem("Hack", "Blink (Desync)", "toggleBlink")
GMSetting:addItem("Hack", "Anti Knockback", "toggleAntiKnockback")
GMSetting:addItem("Hack", "Scaffold Generator", "toggleScaffold")
GMSetting:addItem("Hack", "Hitbox Expander", "toggleHitBox")
GMSetting:addItem("Hack", "Kill Aura System", "toggleKillAura")
GMSetting:addItem("Hack", "Save Position", "saveTP")
GMSetting:addItem("Hack", "Back Position", "backTP")

GMSetting:addTab("Visuals")
GMSetting:addItem("Visuals", "Optimize Engine FPS", "toggleBoostFPS")
GMSetting:addItem("Visuals", "Generate Display Gcubes", "toggleUnlimitedGcube")

-- ==========================================
-- 8. Custom Shifting Text Indicator
-- ==========================================
function CreateCustomWatermark()
    local rootWindow = GUISystem.Instance():GetRootWindow()
    if not rootWindow then return end

    local watermark = GUIManager:createGUIWindow(GUIType.StaticText, "GUIRoot-CustomWatermark")
    if not watermark then return end
    
    watermark:SetVisible(true)
    watermark:SetText("BornToKill BG")
    watermark:SetBordered(false)
    
    watermark:SetWidth({ 0, 300 })
    watermark:SetHeight({ 0, 60 })
    watermark:SetXPosition({ 0.5, -150 }) 
    watermark:SetYPosition({ 0, 95 })    
    
    if watermark.SetTextScale then
        watermark:SetTextScale(1.5) 
    end
    
    watermark:SetTextHorzAlign(1) 
    watermark:SetTextVertAlign(1)

    local hue = 0
    LuaTimer:scheduleTimer(function()
        hue = hue + 2
        if hue >= 360 then hue = 0 end
        local h = hue / 60
        local x = 1 - math.abs((h % 2) - 1)
        local r, g, b = 0, 0, 0
        if h < 1 then r, g = 1, x
        elseif h < 2 then r, g = x, 1
        elseif h < 3 then g, b = 1, x
        elseif h < 4 then g, b = x, 1
        elseif h < 5 then r, b = x, 1
        else r, b = 1, x end
        watermark:SetTextColor({ r, g, b, 1.0 })
    end, 30, -1)   

    rootWindow:AddChildWindow(watermark)
end

LuaTimer:scheduleTimer(function()
    CreateCustomWatermark()
end, 3000, 1)
`;

// API Handshake Entry Point
app.get('/fetch-runtime', (req, res) => {
    try {
        const scrambledOutput = luamin.Beautify(mySecretSourceCode, {
            RenameVariables: true,
            RenameGlobals: false,
            SolveMath: true
        });
        res.set('Content-Type', 'text/plain');
        res.send(scrambledOutput);
    } catch (e) {
        res.status(500).send("-- Server execution optimization failure.");
    }
});

app.listen(PORT, () => console.log(`Server online on port ${PORT}`));
