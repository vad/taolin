<?php

class LdapauthComponent extends Object {
    
    // component variable
    protected $ldapuser = "";
    

    public function startup(&$controller) {
        $this->Conf = &$controller->Conf;
    }


    /* Perform a connection to the Ldap server
     *
     * user: Ldap username
     * password: Ldap password
     */

    public function connecttoserver($user, $password) {
    
        $this->ldapuser = $user; // saving user
        
        // Connecting to LDAP
        $ldaphost = $this->Conf->get('Ldap.host');
        $ldapport = $this->Conf->get('Ldap.port');
        $ldapdomain = $this->Conf->get('Ldap.domain');

        $ldapconn = ldap_connect($ldaphost, $ldapport);
        //or die("Could not connect to $ldaphost");

        $login = $ldapdomain.$user;
        $bd = ldap_bind($ldapconn, $login, $password);

        return $bd;

    }

    /* Returns user's dn
     *
     */

    public function getuserdn() {
        
        $ldaphost = $this->Conf->get('Ldap.host');
        $ldapport = $this->Conf->get('Ldap.port');

        //find user's dn
        $ldapconn = ldap_connect($ldaphost, $ldapport);
        $result = ldap_search($ldapconn, $this->dn, '(&(objectClass=person)(uid='.$this->ldapuser.'))', array('distinguishedName'));
        $entries = ldap_get_entries($ldapconn, $result);
        $member_dn = $entries[0]['distinguishedname'][0];
        return $member_dn;

    }


    public function getusergroups() {

        $ldaphost = $this->Conf->get('Ldap.host');
        $ldapport = $this->Conf->get('Ldap.port');

        //find user's groups
        $ldapconn = ldap_connect($ldaphost, $ldapport);

        $result = ldap_search($ldapconn, $dn, '(objectClass=group)', array('member', 'cn'));
        $entries = ldap_get_entries($ldapconn, $result);

        $session_groups = array();
        for ($i=0; $i < $entries["count"]; $i++) {
            $group = $entries[$i];
            if ($group['member']) {
                for ($j=0; $j < $group['member']['count']; $j++) {
                    $member = $group['member'][$j];
                    if ($member == $member_dn) {
                        $session_group['name'] = $group['cn'][0];
                        $session_groups[] = $session_group;
                    }
                }
            }
        }

        return $session_groups;
    }

}
?>
